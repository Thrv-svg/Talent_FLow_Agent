#!/usr/bin/env python3
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import anthropic

REPO_ROOT = Path(__file__).resolve().parents[2]
AGENT_DIR = REPO_ROOT / ".agent"
INBOX_FILE = AGENT_DIR / "inbox.json"
OUTBOX_FILE = AGENT_DIR / "outbox.json"
STATE_FILE = AGENT_DIR / "state.json"
LOG_FILE = AGENT_DIR / "log.md"

MODEL = "claude-opus-4-8"


def load_json(path, default):
    if path.exists():
        return json.loads(path.read_text())
    return default


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def git(*args):
    return subprocess.run(["git", *args], cwd=REPO_ROOT, capture_output=True, text=True)


def resolve_path(rel_path):
    p = (REPO_ROOT / rel_path.lstrip("/")).resolve()
    if REPO_ROOT != p and REPO_ROOT not in p.parents:
        raise ValueError(f"path escapes repo root: {rel_path}")
    return p


TOOLS = [
    {
        "name": "read_file",
        "description": "Read a file's contents, path relative to the repo root.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": "Write/overwrite a file's contents, path relative to repo root. Creates parent directories as needed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"},
            },
            "required": ["path", "content"],
        },
    },
    {
        "name": "list_dir",
        "description": "List files/directories at a path relative to repo root (non-recursive).",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    },
    {
        "name": "bash",
        "description": "Run a shell command in the repo root. This environment has full internet access (npm install, npx tsc, git, etc. all work).",
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string"}},
            "required": ["command"],
        },
    },
    {
        "name": "propose_alternative",
        "description": "Call this INSTEAD of doing the work when you believe there's a clearly better technical approach than what the owner literally asked for. Sends your proposal to the owner on Telegram and waits for confirmation before any code is touched.",
        "input_schema": {
            "type": "object",
            "properties": {
                "proposal_text": {
                    "type": "string",
                    "description": "Casual, specific explanation of your suggested alternative and why. Same language the owner used.",
                }
            },
            "required": ["proposal_text"],
        },
    },
    {
        "name": "finish_task",
        "description": "Call this when you are done working (task completed, or you need to report a blocker). Sends your summary to the owner on Telegram and ends your turn.",
        "input_schema": {
            "type": "object",
            "properties": {
                "reply_text": {
                    "type": "string",
                    "description": "Casual, specific chat reply: what changed, assumptions made, what's next, or what's blocking you. Same language the owner used.",
                },
                "whats_next": {
                    "type": "string",
                    "description": "One-line note for the log about a natural next step. Can be empty.",
                },
            },
            "required": ["reply_text"],
        },
    },
]


def execute_tool(name, inp):
    try:
        if name == "read_file":
            p = resolve_path(inp["path"])
            if not p.exists():
                return f"ERROR: {inp['path']} does not exist"
            return p.read_text(errors="replace")
        if name == "write_file":
            p = resolve_path(inp["path"])
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(inp["content"])
            return f"wrote {inp['path']}"
        if name == "list_dir":
            p = resolve_path(inp["path"])
            if not p.exists():
                return f"ERROR: {inp['path']} does not exist"
            return "\n".join(
                sorted(x.name + ("/" if x.is_dir() else "") for x in p.iterdir())
            )
        if name == "bash":
            result = subprocess.run(
                inp["command"],
                shell=True,
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                timeout=300,
            )
            return (
                f"exit={result.returncode}\n"
                f"stdout:\n{result.stdout[-4000:]}\n"
                f"stderr:\n{result.stderr[-4000:]}"
            )
    except Exception as e:
        return f"ERROR: {e}"
    return f"ERROR: unknown tool {name}"


SYSTEM_PROMPT = """You are the remote coding agent ("vendor") for "TalentFlow" (React + Express + MongoDB talent-assessment platform). The owner texts you tasks on Telegram when away from their PC. This script runs you every 5 minutes but only calls you when there's actually something new to handle.

You have full internet access here - npm install, npx tsc, git, etc. all work fine.

Workflow:
1. You'll be given recent log context for continuity with past runs.
2. Think about whether there's a clearly better technical approach than literally what the owner asked for.
   - If yes: call `propose_alternative` with your suggested alternative and why. Do NOT make any file changes first. Stop there.
   - If no (the ask is reasonable/unambiguous, or simple): do the actual work using read_file/write_file/list_dir/bash, then call `finish_task` with a summary.
3. If you touch .ts/.tsx files, run `npx tsc --noEmit` via bash and fix anything you break before finishing.
4. Commit your changes yourself via bash (git add + git commit) if you made any - do NOT push; the script pushes after you call finish_task.
5. Never force-push, never delete branches, never run destructive git commands, never print/commit/expose any secret.

All replies (propose_alternative or finish_task): casual/chill tone, not formal/stiff, but specific and useful - no vague filler. Written in the SAME language the owner used (Bahasa Indonesia if they wrote Indonesian, English if English, match natural code-switching). Skimmable as a chat message - short paragraphs/bullets, not a wall of text."""


def call_agent(user_message, log_context):
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
    messages = [
        {
            "role": "user",
            "content": f"Recent log:\n{log_context}\n\n---\n\nOwner's message: {user_message}",
        }
    ]

    for _ in range(30):
        response = client.messages.create(
            model=MODEL,
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            thinking={"type": "adaptive"},
            output_config={"effort": "high"},
            tools=TOOLS,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})

        for block in response.content:
            if block.type == "tool_use" and block.name == "propose_alternative":
                return {"type": "proposal", "text": block.input["proposal_text"]}
            if block.type == "tool_use" and block.name == "finish_task":
                return {
                    "type": "done",
                    "text": block.input["reply_text"],
                    "whats_next": block.input.get("whats_next", ""),
                }

        if response.stop_reason != "tool_use":
            text = "".join(b.text for b in response.content if b.type == "text")
            return {
                "type": "done",
                "text": text or "(selesai, tanpa ringkasan eksplisit)",
                "whats_next": "",
            }

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": str(result)}
                )
        messages.append({"role": "user", "content": tool_results})

    return {
        "type": "done",
        "text": "Kehabisan langkah sebelum selesai - tugasnya kemungkinan lebih kompleks dari perkiraan awal.",
        "whats_next": "",
    }


def main():
    inbox = load_json(INBOX_FILE, [])
    outbox = load_json(OUTBOX_FILE, [])
    state = load_json(STATE_FILE, {"last_processed_update_id": 0, "pending_proposal": None})

    new_entries = [m for m in inbox if m["update_id"] > state["last_processed_update_id"]]
    pending = state.get("pending_proposal")

    if not new_entries and not pending:
        return

    if not new_entries and pending:
        last_check = pending.get("last_nudge_at") or pending["sent_at"]
        last_check_dt = datetime.fromisoformat(last_check.replace("Z", "+00:00"))
        if (datetime.now(timezone.utc) - last_check_dt).total_seconds() >= 8 * 3600:
            outbox.append(
                {"text": f"Masih nunggu jawaban kamu soal ini:\n\n{pending['text']}\n\nGas atau ganti arah?"}
            )
            pending["last_nudge_at"] = now_iso()
            state["pending_proposal"] = pending
            save_json(OUTBOX_FILE, outbox)
            save_json(STATE_FILE, state)
            git("add", ".agent/outbox.json", ".agent/state.json")
            git("commit", "-m", "agent: nudge check-in [skip ci]")
            git("push")
        return

    entry = new_entries[0]
    log_context = LOG_FILE.read_text() if LOG_FILE.exists() else "(no previous log entries)"

    if pending:
        decision_prompt = (
            f"Your earlier proposal was: {pending['text']}\n\n"
            f"The owner just replied: {entry['text']}\n\n"
            "If they agreed (possibly with tweaks), do the work now reflecting their reply, "
            "then call finish_task. If they disagreed or want something different, treat their "
            "reply as the new instruction: think again whether there's a better approach, and "
            "either propose_alternative again or do the work."
        )
        result = call_agent(decision_prompt, log_context)
    else:
        result = call_agent(entry["text"], log_context)

    state["last_processed_update_id"] = entry["update_id"]

    if result["type"] == "proposal":
        state["pending_proposal"] = {"text": result["text"], "sent_at": now_iso(), "last_nudge_at": None}
        outbox.append({"text": result["text"]})
        save_json(OUTBOX_FILE, outbox)
        save_json(STATE_FILE, state)
        git("add", ".agent/outbox.json", ".agent/state.json")
        git("commit", "-m", "agent: propose alternative [skip ci]")
        git("push")
        return

    state["pending_proposal"] = None
    outbox.append({"text": result["text"]})
    with open(LOG_FILE, "a") as f:
        f.write(
            f"\n## {now_iso()}\n**Instruction:** {entry['text']}\n"
            f"**Result:** {result['text']}\n**What's next:** {result.get('whats_next', '')}\n"
        )
    save_json(OUTBOX_FILE, outbox)
    save_json(STATE_FILE, state)
    git("add", "-A")
    git("commit", "-m", f"agent: {entry['text'][:60]}")
    git("push")


if __name__ == "__main__":
    main()
