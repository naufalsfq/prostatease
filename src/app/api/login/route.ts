// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  let db: any;
  try {
    const mod = await import('@/lib/db');
    db = (mod && (mod.default || mod));
  } catch (impErr) {
    console.error('Failed to import DB in /api/login:', impErr);
    return NextResponse.json({ error: 'Server DB error' }, { status: 500 });
  }

  try {
    const { email, password } = await request.json();

    console.log('Percobaan Login Email:', email);

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      console.log('User tidak ditemukan di Database');
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Password salah untuk user:', user.name);
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const token = jwt.sign({ userId: Number(user.id), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Login Berhasil:', user.name, '(ID:', user.id, ')');

    return NextResponse.json({ success: true, token, user: { id: Number(user.id), name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}