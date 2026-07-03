# TalentFlow Recruitment Platform UI Guidance

## 1. Context and Goals
**Design Intent:** Deliver a highly consistent, accessible, and objective assessment experience for applicants alongside a data-centric, structured administration dashboard for HR.

The primary goal of this token-driven UI guidance is to ensure robust implementations that behave predictably across varied devices, support accessibility requirements (WCAG 2.2 AA), and present complex psychometric data (e.g., Kraepelin, DISC) cleanly.

## 2. Design Tokens and Foundations

### Typography
- **Primary Font Family:** `Inter`, fallback `system-ui`, `sans-serif`
- **Base Size:** `16px` (`text-base`)
- **Base Weight:** `400` (`font-normal`)
- **Base Line Height:** `24px` (`leading-6`)
- **Scale:**
  - XS: `12px` (`text-xs`)
  - SM: `14px` (`text-sm`)
  - MD: `16px` (`text-base`)
  - LG: `18px` (`text-lg`)
  - XL: `20px` (`text-xl`)
  - 2XL: `24px` (`text-2xl`)
  - 3XL: `30px` (`text-3xl`)
  - 4XL: `36px` (`text-4xl`)

### Color Palette
- **Text Primary:** `#111827` (`text-gray-900`)
- **Text Secondary:** `#4b5563` (`text-gray-600`)
- **Text Inverse:** `#ffffff` (`text-white`)
- **Primary Brand (Action):** `#4f46e5` (`bg-indigo-600` / `text-indigo-600`)
- **Surface Base:** `#f9fafb` (`bg-gray-50`)
- **Surface Muted:** `#ffffff` (`bg-white`)
- **Surface Raised:** `#e5e7eb` (`bg-gray-200`)
- **Status Success:** `#10b981` (`text-emerald-500` / `bg-emerald-500`)
- **Status Error:** `#ef4444` (`text-red-500` / `bg-red-500`)

### Spacing Scale
- `space.1`: `4px` (`p-1` / `m-1`)
- `space.2`: `8px` (`p-2` / `m-2`)
- `space.3`: `12px` (`p-3` / `m-3`)
- `space.4`: `16px` (`p-4` / `m-4`)
- `space.5`: `24px` (`p-6` / `m-6`)
- `space.6`: `32px` (`p-8` / `m-8`)
- `space.7`: `48px` (`p-12` / `m-12`)
- `space.8`: `64px` (`p-16` / `m-16`)

### Radius, Shadows & Motion
- **Radius:** XS `4px` (`rounded-sm`), SM `6px` (`rounded-md`), MD `8px` (`rounded-lg`), LG `12px` (`rounded-xl`), Full `9999px` (`rounded-full`)
- **Shadows:** SM `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` (`shadow-sm`), MD `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px` (`shadow-md`)
- **Motion:** Instant `150ms` (`duration-150`), Fast `200ms` (`duration-200`), Normal `300ms` (`duration-300`), Slow `500ms` (`duration-500`)  

## 3. Component-Level Rules

### Buttons
- **Anatomy:** Surface background, typography label, optional leading/trailing icon.
- **States:** 
  - *Default:* `color.primary.base` background, `color.text.inverse` text.
  - *Hover:* Darken primary background.
  - *Focus-visible:* Must display a minimum 2px offset focus ring.
  - *Disabled:* Opacity 50%, non-interactive, `cursor-not-allowed`.
  - *Loading:* Display inline spinner; disable interactions.
- **Behavior:** On desktop, triggering on hover/click; on mobile touch target must be at least 44x44px. 

### Data Tables / Assessment Grids (e.g. Kraepelin Grid)
- **Anatomy:** Row/column headers, striped or bordered rows, explicit status badges.
- **States:** Hover state on table rows (`bg-gray-50`) must be implemented to track reading position across wide data.
- **Responsive:** Must contain horizontal overflow scrolling with fixed headers.
- **Interaction:** Input grids like Kraepelin must support keyboard arrow navigation (Up/Down/Left/Right) for rapid data entry without mouse usage.

### Assessment Cards
- **Anatomy:** Surface Muted card, MD radius, MD shadow. Header area. Metric display. Action area.
- **Overflow:** Long text titles must truncate with ellipsis if exceeding container, paired with an accessible `title` attribute or tooltip.

## 4. Accessibility Requirements & Acceptance Criteria
- **Focus Indicators:** 
  - *Testable Criteria:* Tabbing through the application must sequentially highlight every interactive element with a visible 2px outline (no `outline-none` without custom ring fallback).
- **Color Contrast:** 
  - *Testable Criteria:* Text on surface must exceed 4.5:1 ratio. (e.g. `color.text.secondary` on `color.surface.base` must be verified via contrast checker).
- **Keyboard Interactions:** 
  - *Testable Criteria:* Forms must be fully submittable strictly using `Tab`, `Space`, and `Enter`. Dropdowns must use Arrow Up/Down.
- **Touch Target Size:** 
  - *Testable Criteria:* Button, link, and checkbox minimum dimension must be 44x44px on mobile viewport.

## 5. Content and Tone Standards
- **Tone:** Concise, confident, objective, implementation-focused.
- **Examples:**
  - *Correct:* "Submit Application" / *Incorrect:* "Let's Go!"
  - *Correct:* "Assessment Incomplete" / *Incorrect:* "Oops, you forgot the test"
  - *Correct:* "Password must contain 8 characters." / *Incorrect:* "Please make sure your password is long enough."

## 6. Anti-Patterns & Prohibited Implementations
- **No Low-Contrast Text:** Do not use text colors lighter than `#4b5563` on light backgrounds.
- **No Hidden Focus:** Do not use CSS `outline: 0;` or `outline: none;` without providing an alternative like `ring-2`.
- **No Ambiguous Labels:** Avoid buttons labeled "Click Here". Ensure semantic meaning like "View Applicant Profile".
- **No Unplanned Spacing:** Never use one-off padding values like `17px` or `margin-top: 10px`. Always map to the Spacing Scale (e.g., `space.3` = `12px`).

## 7. QA Checklist
- [ ] Are semantic tailwind tokens (mapped from design tokens) used for all colors, spacing, and typography?
- [ ] Do all interactive elements have visible `focus-visible` styles?
- [ ] Is contrast WCAG 2.2 AA compliant for both normal and large text?
- [ ] Can users navigate testing grids cleanly via keyboard navigation?
- [ ] Are empty states gracefully handled (e.g., "No applicants found in this pipeline segment")?
- [ ] Do all interactive elements meet the minimum 44px mobile touch target?
