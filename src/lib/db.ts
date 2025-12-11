// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    q1 INTEGER CHECK(q1 >= 0 AND q1 <= 5),
    q2 INTEGER CHECK(q2 >= 0 AND q2 <= 5),
    q3 INTEGER CHECK(q3 >= 0 AND q3 <= 5),
    q4 INTEGER CHECK(q4 >= 0 AND q4 <= 5),
    q5 INTEGER CHECK(q5 >= 0 AND q5 <= 5),
    q6 INTEGER CHECK(q6 >= 0 AND q6 <= 5),
    q7 INTEGER CHECK(q7 >= 0 AND q7 <= 5),
    qol INTEGER CHECK(qol >= 0 AND qol <= 6),
    total_score INTEGER,
    category TEXT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Ensure backward-compatibility: if columns missing (older DB), add them
try {
  const info = db.prepare("PRAGMA table_info(users)").all();
  const cols = info.map((c: any) => c.name);
  if (!cols.includes('gender')) {
    db.prepare("ALTER TABLE users ADD COLUMN gender TEXT").run();
  }
  if (!cols.includes('avatar')) {
    db.prepare("ALTER TABLE users ADD COLUMN avatar TEXT").run();
  }
} catch (e) {
  // If ALTER fails for any reason, log but continue — app can still run
  console.error('DB migration check error:', e);
}

export default db;