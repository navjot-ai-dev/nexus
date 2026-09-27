
import { relations } from "drizzle-orm";

import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

/* =========================================================
   USER
========================================================= */

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  image: text("image"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* =========================================================
   SESSION
========================================================= */

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    expiresAt: timestamp("expires_at").notNull(),

    token: text("token").notNull().unique(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
  },

  (table) => [
    index("session_userId_idx").on(table.userId),
  ],
);

/* =========================================================
   ACCOUNT
========================================================= */

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    accountId: text("account_id").notNull(),

    providerId: text("provider_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    accessToken: text("access_token"),

    refreshToken: text("refresh_token"),

    idToken: text("id_token"),

    accessTokenExpiresAt: timestamp(
      "access_token_expires_at",
    ),

    refreshTokenExpiresAt: timestamp(
      "refresh_token_expires_at",
    ),

    scope: text("scope"),

    password: text("password"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    index("account_userId_idx").on(table.userId),
  ],
);

/* =========================================================
   VERIFICATION
========================================================= */

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),

    value: text("value").notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (table) => [
    index("verification_identifier_idx").on(
      table.identifier,
    ),
  ],
);

/* =========================================================
   WORKFLOWS
========================================================= */

export const workflows = pgTable(
  "workflow",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),

    description: text("description"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    /*
      React Flow nodes
    */
    nodes: jsonb("nodes")
      .notNull()
      .default([]),

    /*
      React Flow edges
    */
    edges: jsonb("edges")
      .notNull()
      .default([]),

    /*
      false = disabled
      true  = active
    */
    active: boolean("active")
      .notNull()
      .default(false),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    index("workflow_userId_idx").on(
      table.userId,
    ),
  ],
);

/* =========================================================
   WORKFLOW EXECUTIONS
========================================================= */

export const workflowExecutions = pgTable(
  "workflow_execution",
  {
    /*
      Unique execution ID
    */
    id: text("id").primaryKey(),

    /*
      Workflow that was executed
    */
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, {
        onDelete: "cascade",
      }),

    /*
      User who owns the workflow
    */
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    /*
      pending
      running
      completed
      failed
    */
    status: text("status")
      .notNull()
      .default("pending"),

    /*
      Data entering the workflow
    */
    input: jsonb("input")
      .notNull()
      .default({}),

    /*
      Final workflow result
    */
    output: jsonb("output")
      .notNull()
      .default({}),

    /*
      Error message if execution fails
    */
    error: text("error"),

    /*
      Execution start time
    */
    startedAt: timestamp("started_at"),

    /*
      Execution completion time
    */
    completedAt: timestamp("completed_at"),

    /*
      Execution creation time
    */
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index(
      "workflow_execution_workflowId_idx",
    ).on(table.workflowId),

    index(
      "workflow_execution_userId_idx",
    ).on(table.userId),

    index(
      "workflow_execution_status_idx",
    ).on(table.status),
  ],
);

/* =========================================================
   USER RELATIONS
========================================================= */

export const userRelations = relations(
  user,
  ({ many }) => ({
    sessions: many(session),

    accounts: many(account),

    workflows: many(workflows),

    workflowExecutions: many(
      workflowExecutions,
    ),
  }),
);

/* =========================================================
   SESSION RELATIONS
========================================================= */

export const sessionRelations = relations(
  session,
  ({ one }) => ({
    user: one(user, {
      fields: [session.userId],

      references: [user.id],
    }),
  }),
);

/* =========================================================
   ACCOUNT RELATIONS
========================================================= */

export const accountRelations = relations(
  account,
  ({ one }) => ({
    user: one(user, {
      fields: [account.userId],

      references: [user.id],
    }),
  }),
);

/* =========================================================
   WORKFLOW RELATIONS
========================================================= */

export const workflowRelations = relations(
  workflows,
  ({ one, many }) => ({
    user: one(user, {
      fields: [workflows.userId],

      references: [user.id],
    }),

    executions: many(
      workflowExecutions,
    ),
  }),
);

/* =========================================================
   WORKFLOW EXECUTION RELATIONS
========================================================= */

export const workflowExecutionRelations =
  relations(
    workflowExecutions,
    ({ one }) => ({
      workflow: one(workflows, {
        fields: [
          workflowExecutions.workflowId,
        ],

        references: [workflows.id],
      }),

      user: one(user, {
        fields: [
          workflowExecutions.userId,
        ],

        references: [user.id],
      }),
    }),
  );

