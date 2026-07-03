import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

export interface UserEntry {
  id: string;
  email: string;
  password: string;
  role: 'pelamar' | 'admin' | 'hr';
  profile: any;
  psychResults?: any;
  quizScoresLog?: any[];
  aiReport?: any;
}

export async function openDb(): Promise<Database> {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initDb(): Promise<Database> {
  const db = await openDb();

  // MIGRATION: Rename old 'nilai' table to 'assessment_results' if it exists and uses old schema
  try {
    const dbColumns = await db.all("PRAGMA table_info(nilai)");
    const hasEmailCol = dbColumns.some((c: any) => c.name === 'email');
    if (dbColumns.length > 0 && !hasEmailCol) {
      await db.exec('ALTER TABLE nilai RENAME TO assessment_results');
    }
  } catch (e) {
    console.error('Migration error:', e);
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      profile TEXT,
      psychResults TEXT,
      quizScoresLog TEXT,
      aiReport TEXT
    );
    CREATE TABLE IF NOT EXISTS assessment_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      test_type TEXT,
      score_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS nilai (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      quizId TEXT,
      category TEXT,
      score INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(email) REFERENCES users(email)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      name TEXT,
      nik TEXT,
      uploadTime TEXT,
      status TEXT,
      refNumber TEXT,
      amount INTEGER,
      method TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS global_majors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eduLevel TEXT,
      majorName TEXT UNIQUE
    );
  `);

  const countRow = await db.get('SELECT COUNT(*) as count FROM users');
  if (countRow.count === 0) {
    console.log('Seeding initial users...');
    const accountSeeds = [
      { id: 1, email: 'user1@dummy.com', pass: 'user123', role: 'pelamar', nik: '1111111111111111' },
      { id: 2, email: 'user2@dummy.com', pass: 'user123', role: 'pelamar', nik: '2222222222222222' },
      { id: 3, email: 'hr@dummy.com', pass: 'hr123', role: 'hr', nik: '3333333333333333' },
      { id: 4, email: 'admin@dummy.com', pass: 'admin123', role: 'admin', nik: '4444444444444444' },
      { id: 6, email: 'user3@dummy.com', pass: 'user123', role: 'pelamar', nik: '5555555555555555' },
      { id: 7, email: 'user4@dummy.com', pass: 'user123', role: 'pelamar', nik: '6666666666666666' },
      { id: 8, email: 'user5@dummy.com', pass: 'user123', role: 'pelamar', nik: '7777777777777777' },
      { id: 9, email: 'user6@dummy.com', pass: 'user123', role: 'pelamar', nik: '8888888888888888' },
      { id: 10, email: 'user7@dummy.com', pass: 'user123', role: 'pelamar', nik: '9999999999999999' },
      { id: 11, email: 'user8@dummy.com', pass: 'user123', role: 'pelamar', nik: '1010101010101010' },
      { id: 12, email: 'user9@dummy.com', pass: 'user123', role: 'pelamar', nik: '2020202020202020' },
      { id: 13, email: 'user10@dummy.com', pass: 'user123', role: 'pelamar', nik: '3030303030303030' },
      { id: 14, email: 'user11@dummy.com', pass: 'user123', role: 'pelamar', nik: '4040404040404040' },
      { id: 15, email: 'user12@dummy.com', pass: 'user123', role: 'pelamar', nik: '5050505050505050' },
      { id: 16, email: 'user13@dummy.com', pass: 'user123', role: 'pelamar', nik: '6060606060606060' },
      { id: 17, email: 'user14@dummy.com', pass: 'user123', role: 'pelamar', nik: '7070707070707070' }
    ];

    const defaultUsers: UserEntry[] = await Promise.all(accountSeeds.map(async acc => {
      const hashedPassword = await bcrypt.hash(acc.pass, 10);
      return {
        id: acc.id.toString(),
        email: acc.email,
        password: hashedPassword,
        role: acc.role as 'pelamar' | 'admin' | 'hr',
        profile: {
          id: acc.id.toString(),
          name: acc.email.split('@')[0],
          email: acc.email,
          whatsapp: '0812' + Math.floor(10000000 + Math.random() * 90000000).toString(),
          nik: acc.nik,
          headline: acc.role === 'admin' ? 'Administrator Platform' : (acc.role === 'hr' ? 'HR Specialist' : 'Active Pelamar | Siap Berkontribusi'),
          educationLevel: acc.role !== 'pelamar' ? 'S1 Lulusan' : 'SMA/SMK',
          major: acc.role !== 'pelamar' ? 'Bisnis & Manajemen' : 'Umum',
          isPremium: acc.role !== 'pelamar',
          role: acc.role,
          stats: acc.role !== 'pelamar' 
            ? { ovr: 99, acd: 95, spd: 95, con: 95, str: 95, com: 95, ldr: 95, dtl: 95 } 
            : { 
                ovr: Math.floor(Math.random() * 40) + 50, 
                acd: Math.floor(Math.random() * 50) + 50, 
                spd: Math.floor(Math.random() * 50) + 50, 
                con: Math.floor(Math.random() * 50) + 50, 
                str: Math.floor(Math.random() * 50) + 50, 
                com: Math.floor(Math.random() * 50) + 50, 
                ldr: Math.floor(Math.random() * 50) + 50, 
                dtl: Math.floor(Math.random() * 50) + 50 
              },
          cosmetics: { theme: acc.role !== 'pelamar' ? 'gold' : 'classic', bannerUrl: '', avatarFrame: acc.role !== 'pelamar', glowEffect: acc.role !== 'pelamar' }
        },
        psychResults: acc.role !== 'pelamar'
          ? {
              papi: {
                scores: { G: 8, L: 9, I: 7, T: 6, V: 8, S: 7, R: 8, Z: 5, O: 6, B: 5, X: 4, P: 8, A: 9, N: 7, F: 4, W: 8, K: 7, E: 8, H: 6, D: 9 },
                roles: ['Leadership', 'Hard Worker', 'Decision Maker'],
                needs: ['Precision & Details (D)', 'Rules Cleared (W)']
              },
              disc: { scores: { D: 8, I: 6, S: 4, C: 7 }, style: 'Dominant Director' },
              kraepelin: { speed: 95, accuracy: 95, stability: 95 }
            }
          : {
              papi: {
                scores: ['G','L','I','T','V','S','R','Z','O','B','X','P','A','N','F','W','K','E','H','D'].reduce((acc, t) => {
                  acc[t] = Math.floor(Math.random() * 6) + 3;
                  return acc;
                }, {} as Record<string, number>),
                roles: ['Team Operator'],
                needs: ['Support & Guidelines (F)']
              },
              disc: { scores: { D: Math.floor(Math.random()*10), I: Math.floor(Math.random()*10), S: Math.floor(Math.random()*10), C: Math.floor(Math.random()*10) }, style: 'Steady Supporter' },
              kraepelin: { speed: Math.floor(Math.random()*30 + 50), accuracy: Math.floor(Math.random()*30 + 50), stability: Math.floor(Math.random()*30 + 50) }
            },
        quizScoresLog: [],
        aiReport: null
      };
    }));

    for (const u of defaultUsers) {
      await db.run(
        `INSERT INTO users (id, email, password, role, profile, psychResults, quizScoresLog, aiReport) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.email, u.password, u.role, JSON.stringify(u.profile), JSON.stringify(u.psychResults), JSON.stringify(u.quizScoresLog), JSON.stringify(u.aiReport)]
      );
    }
  }

  // Purge dummy applicants to keep only real data
  await db.run('DELETE FROM users WHERE email LIKE "%@dummy.com" AND role = "pelamar"');

  return db;
}
