import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import { db, sessions, users, profiles, creatorStats, privacySettings } from "@workspace/db";

const scrypt = promisify(scryptCallback);
const SESSION_DAYS = 30;
export const SESSION_COOKIE = "px_session";

type SessionUser = { id: string; email: string; username: string; displayName: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(key, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function createSession(userId: string, res: Response) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ userId, tokenHash: hashToken(token), expiresAt });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearSession(req: Request, res: Response) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (token) await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function getCurrentUser(req: Request): Promise<SessionUser | null> {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) return null;
  const rows = await db
    .select({ id: users.id, email: users.email, username: profiles.username, displayName: profiles.displayName })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function bootstrapUser(userId: string) {
  await db.insert(creatorStats).values({ userId }).onConflictDoNothing();
  await db.insert(privacySettings).values({ userId }).onConflictDoNothing();
}

export async function requireUser(req: Request, res: Response) {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated." });
    return null;
  }
  return user;
}
