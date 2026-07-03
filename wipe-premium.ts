import { initDb } from './database.js';

async function run() {
  const db = await initDb();
  // Only applicants ('pelamar') purchase premium; HR/admin accounts have premium cosmetics seeded by default and must not be touched.
  const users = await db.all("SELECT * FROM users WHERE role = 'pelamar'");
  for (const user of users) {
    if (user.profile) {
      let profile = JSON.parse(user.profile);
      profile.isPremium = false;
      if (profile.cosmetics) {
        profile.cosmetics.theme = 'classic';
        profile.cosmetics.avatarFrame = false;
        profile.cosmetics.glowEffect = false;
      }
      await db.run('UPDATE users SET profile = ? WHERE id = ?', [JSON.stringify(profile), user.id]);
    }
  }
  console.log('Removed all premium members successfully.');
}

run();
