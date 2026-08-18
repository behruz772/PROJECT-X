import { Router } from "express";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { db, profiles, users } from "@workspace/db";
import { bootstrapUser, clearSession, createSession, getCurrentUser, hashPassword, verifyPassword } from "../lib/auth";

const router = Router();
const credentials = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
});
const signup = credentials.extend({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,24}$/),
  displayName: z.string().trim().min(1).max(80),
});

function publicUser(user: { id: string; email: string; username: string; displayName: string }) {
  return { id: user.id, email: user.email, username: user.username, displayName: user.displayName };
}

router.post("/auth/signup", async (req, res, next) => {
  try {
    const input = signup.parse(req.body);
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(or(eq(users.email, input.email), eq(profiles.username, input.username)))
      .limit(1);
    if (existing) return res.status(409).json({ error: "Email or username is already in use." });

    const [user] = await db.insert(users).values({ email: input.email, passwordHash: await hashPassword(input.password) }).returning();
    if (!user) return res.status(500).json({ error: "Could not create account." });
    await db.insert(profiles).values({ userId: user.id, username: input.username, displayName: input.displayName });
    await bootstrapUser(user.id);
    await createSession(user.id, res);
    return res.status(201).json({ user: publicUser({ id: user.id, email: user.email, username: input.username, displayName: input.displayName }) });
  } catch (error) { return next(error); }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const input = credentials.parse(req.body);
    const rows = await db.select({ user: users, profile: profiles }).from(users).innerJoin(profiles, eq(profiles.userId, users.id)).where(eq(users.email, input.email)).limit(1);
    const row = rows[0];
    if (!row?.user.passwordHash || !(await verifyPassword(input.password, row.user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    await createSession(row.user.id, res);
    return res.json({ user: publicUser({ id: row.user.id, email: row.user.email, username: row.profile.username, displayName: row.profile.displayName }) });
  } catch (error) { return next(error); }
});

router.post("/auth/logout", async (req, res, next) => {
  try { await clearSession(req, res); return res.status(204).send(); } catch (error) { return next(error); }
});

router.get("/auth/me", async (req, res, next) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: "Not authenticated." });
    return res.json({ user });
  } catch (error) { return next(error); }
});

export default router;
