import { Router } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, creatorStats, interactions, posts, profiles } from "@workspace/db";
import { requireUser } from "../lib/auth";

const router = Router();
const createPost = z.object({
  type: z.enum(["text", "photo", "video", "reel"]),
  text: z.string().max(5000).default(""),
  mediaUrl: z.string().url().nullable().optional(),
  visibility: z.enum(["public", "followers", "private"]).default("public"),
});
const interaction = z.object({ type: z.enum(["helpful", "inspired", "learned", "collaborated"]) });

router.get("/me", async (req, res, next) => {
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const [stats] = await db.select().from(creatorStats).where(eq(creatorStats.userId, user.id)).limit(1);
    return res.json({ user, stats: stats ?? null });
  } catch (error) { return next(error); }
});

router.get("/profiles/:username", async (req, res, next) => {
  try {
    const rows = await db.select().from(profiles).where(eq(profiles.username, req.params.username.toLowerCase())).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Creator not found." });
    const [stats] = await db.select().from(creatorStats).where(eq(creatorStats.userId, rows[0].userId)).limit(1);
    return res.json({ profile: rows[0], stats: stats ?? null });
  } catch (error) { return next(error); }
});

router.get("/posts", async (_req, res, next) => {
  try {
    const rows = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(50);
    return res.json({ posts: rows });
  } catch (error) { return next(error); }
});

router.post("/posts", async (req, res, next) => {
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const input = createPost.parse(req.body);
    const [post] = await db.insert(posts).values({ ...input, authorId: user.id }).returning();
    if (!post) return res.status(500).json({ error: "Could not create post." });
    await db.update(creatorStats).set({
      creations: sql`${creatorStats.creations} + 1`,
      updatedAt: new Date(),
    }).where(eq(creatorStats.userId, user.id));
    return res.status(201).json({ post });
  } catch (error) { return next(error); }
});

router.post("/posts/:postId/interactions", async (req, res, next) => {
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const input = interaction.parse(req.body);
    const [post] = await db.select({ id: posts.id, authorId: posts.authorId }).from(posts).where(eq(posts.id, req.params.postId)).limit(1);
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.authorId === user.id) return res.status(400).json({ error: "Creators cannot boost their own contribution." });

    const existing = await db.select({ id: interactions.id }).from(interactions).where(and(
      eq(interactions.actorId, user.id),
      eq(interactions.postId, post.id),
      eq(interactions.type, input.type),
    )).limit(1);
    if (existing[0]) return res.json({ accepted: false, reason: "already_recorded" });

    await db.insert(interactions).values({ actorId: user.id, postId: post.id, type: input.type });
    const counter = { helpful: creatorStats.helpful, inspired: creatorStats.inspired, learned: creatorStats.learned, collaborated: creatorStats.collaborations }[input.type];
    if (input.type === "helpful") {
      await db.update(creatorStats).set({ helpful: sql`${counter} + 1`, updatedAt: new Date() }).where(eq(creatorStats.userId, post.authorId));
    } else if (input.type === "inspired") {
      await db.update(creatorStats).set({ inspired: sql`${counter} + 1`, updatedAt: new Date() }).where(eq(creatorStats.userId, post.authorId));
    } else if (input.type === "learned") {
      await db.update(creatorStats).set({ learned: sql`${counter} + 1`, updatedAt: new Date() }).where(eq(creatorStats.userId, post.authorId));
    } else {
      await db.update(creatorStats).set({ collaborations: sql`${counter} + 1`, updatedAt: new Date() }).where(eq(creatorStats.userId, post.authorId));
    }
    return res.status(201).json({ accepted: true });
  } catch (error) { return next(error); }
});

export default router;
