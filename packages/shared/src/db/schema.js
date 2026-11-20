import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const deploymentStatusEnum = pgEnum("deployment_status", [
  "QUEUED",
  "BUILDING",
  "READY",
  "FAILED",
]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  gitUrl: text("git_url").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  activeDeploymentId: uuid("active_deployment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deployments = pgTable("deployments", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  status: deploymentStatusEnum("status").default("QUEUED").notNull(),
  commitHash: text("commit_hash"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
});

export const buildLogs = pgTable("build_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  deploymentId: uuid("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),
  log: text("log").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
