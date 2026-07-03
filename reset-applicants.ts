import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function resetApplicants() {
    try {
        const db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        // 3. FETCH & ITERATE: Select all rows from the users table where role = 'pelamar'.
        const pelamars = await db.all("SELECT id, profile FROM users WHERE role = 'pelamar'");
        console.log(`Found ${pelamars.length} applicants to reset...`);

        let updateCount = 0;

        for (const user of pelamars) {
            let profile;
            try {
                profile = JSON.parse(user.profile);
            } catch (parseError) {
                console.error(`Skipping user ${user.id}: malformed profile JSON`, parseError);
                continue;
            }

            // 4. DATA MUTATION
            profile.isOnboarded = false;
            if (profile.stats) {
                profile.stats = { ovr: 0, acd: 0, spd: 0, con: 0, str: 0, com: 0, ldr: 0, dtl: 0 };
            }

            const updatedProfileStr = JSON.stringify(profile);
            const emptyPsychResultsStr = JSON.stringify({});
            const emptyQuizScoresLogStr = JSON.stringify([]);
            const nullAiReportStr = JSON.stringify(null);

            // 5. UPDATE
            await db.run(
                `UPDATE users SET
                    profile = ?,
                    psychResults = ?,
                    quizScoresLog = ?,
                    aiReport = ?
                 WHERE id = ?`,
                [updatedProfileStr, emptyPsychResultsStr, emptyQuizScoresLogStr, nullAiReportStr, user.id]
            );

            updateCount++;
        }

        // 6. LOGGING
        console.log(`Successfully reset ${updateCount} applicants.`);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

resetApplicants();
