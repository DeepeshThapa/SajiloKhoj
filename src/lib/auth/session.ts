import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

const SECRET_KEY = process.env.AUTH_SECRET || 'sajilo_khoj_super_secure_secret_jwt_key_2026_at_least_32_bytes_long';
const key = new TextEncoder().encode(SECRET_KEY);

export const SESSION_COOKIE_NAME = 'sajilo_session';

export interface SessionPayload {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: Role;
  expiresAt: number;
}

export async function encryptSession(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decryptSession(sessionToken: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(sessionToken, key, {
      algorithms: ['HS256'],
    });
    const p = payload as any;
    return {
      id: p.id || p.userId,
      userId: p.userId || p.id,
      email: p.email,
      name: p.name,
      role: p.role,
      expiresAt: p.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; email: string; name: string; role: Role }) {
  const token = await encryptSession({
    id: user.id,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
