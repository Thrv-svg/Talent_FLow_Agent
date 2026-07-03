import { initDb } from './database.js';

async function wipeAllScores() {
  try {
    console.log('Connecting to database...');
    const db = await initDb();
    
    console.log('Fetching applicants...');
    const users = await db.all("SELECT id, profile FROM users WHERE role = 'pelamar'");

    console.log(`Found ${users.length} applicants. Wiping scores...`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      if (user.profile) {
        let profile = JSON.parse(user.profile);
        
        if (profile.stats) {
          profile.stats = {
            ovr: 0,
            acd: 0,
            spd: 0,
            con: 0,
            str: 0,
            com: 0,
            ldr: 0,
            dtl: 0
          };
        }
        
        await db.run(
          `UPDATE users 
           SET profile = ?, 
               psychResults = ?, 
               quizScoresLog = ?, 
               aiReport = ? 
           WHERE id = ?`,
          [
            JSON.stringify(profile), 
            JSON.stringify({}), 
            JSON.stringify([]), 
            null, 
            user.id
          ]
        );
        updatedCount++;
      }
    }
    
    console.log(`Successfully wiped scores for ${updatedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error wiping scores:', error);
    process.exit(1);
  }
}

wipeAllScores();
