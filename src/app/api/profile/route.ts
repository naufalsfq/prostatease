// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const getUserIdFromToken = (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return Number(decoded.userId);
  } catch (err) {
    return null;
  }
};

async function getDbSafely() {
  try {
    const mod = await import('@/lib/db');
    return (mod && (mod.default || mod));
  } catch (err) {
    console.error('Failed to import DB in /api/profile:', err);
    return null;
  }
}

export async function GET(request: Request) {
  const db = await getDbSafely();
  if (!db) return NextResponse.json({ error: 'Server DB error' }, { status: 500 });

  try {
    const userId = getUserIdFromToken(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = db.prepare('SELECT id, name, email, dob, gender, avatar, created_at FROM users WHERE id = ?').get(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Profile GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const db = await getDbSafely();
  if (!db) return NextResponse.json({ error: 'Server DB error' }, { status: 500 });

  try {
    const userId = getUserIdFromToken(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, dob, gender, avatar } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    db.prepare('UPDATE users SET name = ?, dob = ?, gender = ?, avatar = ? WHERE id = ?')
      .run(name, dob || null, gender || null, avatar || null, userId);

    const updated = db.prepare('SELECT id, name, email, dob, gender, avatar, created_at FROM users WHERE id = ?').get(userId);
    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error('Profile PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
