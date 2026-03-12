import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "standard",
  "readonly",
]);
export const stageEnum = pgEnum("stage", [
  "outreach",
  "discovery",
  "leavebehind",
  "diligence",
  "strategy",
  "close",
  "lost",
  "paused",
]);
export const temperatureEnum = pgEnum("temperature", ["hot", "warm", "cold"]);
export const sourceEnum = pgEnum("source", [
  "referral",
  "linkedin",
  "personal",
  "other",
]);
export const investmentExperienceEnum = pgEnum("investment_experience", [
  "novice",
  "intermediate",
  "sophisticated",
]);
export const riskToleranceEnum = pgEnum("risk_tolerance", [
  "conservative",
  "moderate",
  "aggressive",
]);
export const foundingStatusEnum = pgEnum("founding_status", [
  "founding",
  "standard",
  "undecided",
]);
export const activityTypeEnum = pgEnum("activity_type", [
  "phone_call",
  "email_sent",
  "email_received",
  "link_sent",
  "link_viewed",
  "meeting_zoom",
  "meeting_inperson",
  "document_sent",
  "note",
  "stage_change",
  "follow_up_set",
  "objection_logged",
  "message_sent",
]);
export const linkTypeEnum = pgEnum("link_type", [
  "dashboard",
  "freedom",
  "epig",
]);
export const messageChannelEnum = pgEnum("message_channel", [
  "email",
  "whatsapp",
  "telegram",
]);
export const messageStatusEnum = pgEnum("message_status", [
  "queued",
  "sent",
  "delivered",
  "failed",
  "read",
]);
export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
]);

// Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("admin"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prospects = pgTable("prospects", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  telegramUsername: varchar("telegram_username", { length: 100 }),
  mailingAddress: text("mailing_address"),
  dateOfBirth: date("date_of_birth"),
  spouseName: varchar("spouse_name", { length: 200 }),
  spouseEmail: varchar("spouse_email", { length: 255 }),
  // Financial profile
  investableCapital: decimal("investable_capital", {
    precision: 15,
    scale: 2,
  }).notNull(),
  annualIncome: decimal("annual_income", { precision: 15, scale: 2 }),
  currentAdvisor: varchar("current_advisor", { length: 200 }),
  currentFeePct: decimal("current_fee_pct", { precision: 5, scale: 2 }),
  investmentExperience: investmentExperienceEnum("investment_experience"),
  riskTolerance: riskToleranceEnum("risk_tolerance"),
  tenYearGoal: text("ten_year_goal"),
  targetMonthlyIncome: decimal("target_monthly_income", {
    precision: 15,
    scale: 2,
  }),
  // Sales intelligence
  source: sourceEnum("source").notNull(),
  sourceDetail: text("source_detail"),
  temperature: temperatureEnum("temperature").notNull().default("warm"),
  leadScore: integer("lead_score"),
  stage: stageEnum("stage").notNull().default("outreach"),
  stageEnteredAt: timestamp("stage_entered_at").notNull().defaultNow(),
  foundingVsStandard: foundingStatusEnum("founding_vs_standard")
    .notNull()
    .default("undecided"),
  customPlanSent: boolean("custom_plan_sent").notNull().default(false),
  customPlanDate: date("custom_plan_date"),
  nextFollowUp: date("next_follow_up"),
  estimatedCloseDate: date("estimated_close_date"),
  estimatedAum: decimal("estimated_aum", { precision: 15, scale: 2 }),
  notes: text("notes"),
  lostReason: varchar("lost_reason", { length: 50 }),
  lostReasonDetail: text("lost_reason_detail"),
  // Meta
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  type: activityTypeEnum("type").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  notes: text("notes"),
  durationMinutes: integer("duration_minutes"),
  outcome: varchar("outcome", { length: 200 }),
  metadata: jsonb("metadata"), // flexible extra data per activity type
  complianceFlag: boolean("compliance_flag").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const linksSent = pgTable("links_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  linkType: linkTypeEnum("link_type").notNull(),
  sentDate: timestamp("sent_date").notNull().defaultNow(),
  deliveryMethod: varchar("delivery_method", { length: 50 }),
  createdBy: uuid("created_by").references(() => users.id),
});

export const linkViews = pgTable("link_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  linkSentId: uuid("link_sent_id").references(() => linksSent.id),
  pageUrl: text("page_url"),
  timeOnPage: integer("time_on_page"),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

export const checklistSections = pgTable("checklist_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const checklistItems = pgTable("checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => checklistSections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  owner: varchar("owner", { length: 200 }),
  dueDate: date("due_date"),
  notes: text("notes"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const objectionRegistry = pgTable("objection_registry", {
  id: uuid("id").primaryKey().defaultRandom(),
  objectionText: text("objection_text").notNull(),
  primaryAsset: varchar("primary_asset", { length: 200 }).notNull(),
  resolutionConfidence: integer("resolution_confidence").notNull(),
  suggestedResponse: text("suggested_response").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prospectObjections = pgTable("prospect_objections", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  objectionId: uuid("objection_id")
    .notNull()
    .references(() => objectionRegistry.id),
  status: varchar("status", { length: 30 })
    .notNull()
    .default("raised"), // raised, resolved, partially_resolved, escalated
  raisedAt: timestamp("raised_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
});

export const messageTemplates = pgTable("message_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  channel: messageChannelEnum("channel").notNull(),
  subject: varchar("subject", { length: 500 }), // email only
  body: text("body").notNull(),
  stageTrigger: stageEnum("stage_trigger"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messagesSent = pgTable("messages_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id")
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  channel: messageChannelEnum("channel").notNull(),
  templateId: uuid("template_id").references(() => messageTemplates.id),
  batchId: uuid("batch_id").references(() => messageBatches.id),
  subject: varchar("subject", { length: 500 }),
  body: text("body").notNull(),
  status: messageStatusEnum("status").notNull().default("queued"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  errorMessage: text("error_message"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageBatches = pgTable("message_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  channel: messageChannelEnum("channel").notNull(),
  templateId: uuid("template_id").references(() => messageTemplates.id),
  recipientFilter: jsonb("recipient_filter"),
  totalCount: integer("total_count").notNull().default(0),
  sentCount: integer("sent_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: uuid("record_id").notNull(),
  action: auditActionEnum("action").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Prospect = typeof prospects.$inferSelect;
export type NewProspect = typeof prospects.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type LinkSent = typeof linksSent.$inferSelect;
export type ChecklistSection = typeof checklistSections.$inferSelect;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type ObjectionRegistryEntry = typeof objectionRegistry.$inferSelect;
export type ProspectObjection = typeof prospectObjections.$inferSelect;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type MessageSent = typeof messagesSent.$inferSelect;
export type MessageBatch = typeof messageBatches.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
