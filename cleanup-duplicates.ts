import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function runCleanup() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  console.log("Starting duplicates cleanup...");

  const users = await db.all('SELECT * FROM users');

  const keepIds = new Set<string>();
  const deleteIds = new Set<string>();

  const seenEmails = new Set<string>();
  const seenNames = new Set<string>();
  const seenNiks = new Set<string>();
  const seenPhones = new Set<string>();

  // Sort by ID to try to keep the first one
  users.sort((a, b) => a.id.localeCompare(b.id));

  for (const user of users) {
    const email = user.email ? user.email.toLowerCase() : '';
    let name = '';
    let nik = '';
    let phone = '';

    try {
      const profile = JSON.parse(user.profile || '{}');
      name = profile.name ? profile.name.toLowerCase() : '';
      nik = profile.nik || '';
      phone = profile.whatsapp || profile.phone || '';
    } catch (e) {
      // ignore
    }

    if (
      (email && seenEmails.has(email)) ||
      (name && seenNames.has(name)) ||
      (nik && seenNiks.has(nik)) ||
      (phone && seenPhones.has(phone))
    ) {
      deleteIds.add(user.id);
    } else {
      keepIds.add(user.id);
      if (email) seenEmails.add(email);
      if (name) seenNames.add(name);
      if (nik) seenNiks.add(nik);
      if (phone) seenPhones.add(phone);
    }
  }

  let deletedCount = 0;
  for (const id of deleteIds) {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    deletedCount++;
  }

  console.log(`Cleanup finished. Deleted ${deletedCount} duplicate rows.`);
}

runCleanup().catch(console.error);
