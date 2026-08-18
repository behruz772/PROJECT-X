import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  index,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio").notNull().default(""),
  avatarUrl: text("avatar_url"),
  countryCode: text("country_code"),
  skills: jsonb("skills").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ userIdx: index("sessions_user_idx").on(table.userId) }));

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  text: text("text").notNull().default(""),
  mediaUrl: text("media_url"),
  audioId: uuid("audio_id"),
  visibility: text("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const audio = pgTable("audio", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  sourceUrl: text("source_url"),
  licenseStatus: text("license_status").notNull().default("original"),
  allowedUses: jsonb("allowed_uses").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  territories: jsonb("territories").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const creatorStats = pgTable("creator_stats", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  level: integer("level").notNull().default(1),
  creations: integer("creations").notNull().default(0),
  projects: integer("projects").notNull().default(0),
  helpful: integer("helpful").notNull().default(0),
  inspired: integer("inspired").notNull().default(0),
  learned: integer("learned").notNull().default(0),
  collaborations: integer("collaborations").notNull().default(0),
  reputationScore: real("reputation_score").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const follows = pgTable("follows", {
  followerId: uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ pairIdx: uniqueIndex("follows_pair_idx").on(table.followerId, table.followingId) }));

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull().default("direct"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversationMembers = pgTable("conversation_members", {
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ memberIdx: uniqueIndex("conversation_members_idx").on(table.conversationId, table.userId) }));

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  originalLanguage: text("original_language"),
  translation: text("translation"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interactions = pgTable("interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ uniqueInteraction: uniqueIndex("interactions_unique_idx").on(table.actorId, table.postId, table.type) }));

export const savedItems = pgTable("saved_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentType: text("content_type").notNull(),
  contentId: uuid("content_id").notNull(),
  collectionName: text("collection_name").notNull().default("Saved"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ savedUnique: uniqueIndex("saved_items_unique_idx").on(table.userId, table.contentType, table.contentId) }));

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rankingSnapshots = pgTable("ranking_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  scope: text("scope").notNull(),
  category: text("category"),
  rank: integer("rank").notNull(),
  total: integer("total").notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
});

export const privacySettings = pgTable("privacy_settings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  worldRankVisible: boolean("world_rank_visible").notNull().default(true),
  countryRankVisible: boolean("country_rank_visible").notNull().default(true),
  friendsRankingEnabled: boolean("friends_ranking_enabled").notNull().default(true),
  positionVisible: boolean("position_visible").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ createdAt: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type CreatorStats = typeof creatorStats.$inferSelect;
