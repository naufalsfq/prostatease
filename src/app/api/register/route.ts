// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  let db: any;
  try {
    const mod = await import('@/lib/db');
    db = (mod && (mod.default || mod));
  } catch (impErr) {
    console.error('Failed to import DB in /api/register:', impErr);
    return NextResponse.json({ error: 'Server DB error' }, { status: 500 });
  }

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Mohon lengkapi semua data' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email ini sudah terdaftar. Silakan login.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(`INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`).run(name, email, hashedPassword);

    return NextResponse.json({ success: true, message: 'Registrasi berhasil', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat mendaftar' }, { status: 500 });
  }
}