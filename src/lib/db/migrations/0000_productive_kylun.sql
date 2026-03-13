CREATE TYPE "public"."activity_type" AS ENUM('phone_call', 'email_sent', 'email_received', 'link_sent', 'link_viewed', 'meeting_zoom', 'meeting_inperson', 'document_sent', 'note', 'stage_change', 'follow_up_set', 'objection_logged', 'message_sent');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."founding_status" AS ENUM('founding', 'standard', 'undecided');--> statement-breakpoint
CREATE TYPE "public"."investment_experience" AS ENUM('novice', 'intermediate', 'sophisticated');--> statement-breakpoint
CREATE TYPE "public"."link_type" AS ENUM('dashboard', 'freedom', 'epig');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('email', 'whatsapp', 'telegram');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('queued', 'sent', 'delivered', 'failed', 'read');--> statement-breakpoint
CREATE TYPE "public"."risk_tolerance" AS ENUM('conservative', 'moderate', 'aggressive');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('referral', 'linkedin', 'personal', 'other');--> statement-breakpoint
CREATE TYPE "public"."stage" AS ENUM('outreach', 'discovery', 'leavebehind', 'diligence', 'strategy', 'close', 'lost', 'paused');--> statement-breakpoint
CREATE TYPE "public"."temperature" AS ENUM('hot', 'warm', 'cold');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'standard', 'readonly');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"type" "activity_type" NOT NULL,
	"title" varchar(500) NOT NULL,
	"notes" text,
	"duration_minutes" integer,
	"outcome" varchar(200),
	"metadata" jsonb,
	"compliance_flag" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"record_id" uuid NOT NULL,
	"action" "audit_action" NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"owner" varchar(200),
	"due_date" date,
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"link_sent_id" uuid,
	"page_url" text,
	"time_on_page" integer,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links_sent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"link_type" "link_type" NOT NULL,
	"sent_date" timestamp DEFAULT now() NOT NULL,
	"delivery_method" varchar(50),
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "message_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"channel" "message_channel" NOT NULL,
	"template_id" uuid,
	"recipient_filter" jsonb,
	"total_count" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"channel" "message_channel" NOT NULL,
	"subject" varchar(500),
	"body" text NOT NULL,
	"stage_trigger" "stage",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages_sent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"channel" "message_channel" NOT NULL,
	"template_id" uuid,
	"batch_id" uuid,
	"subject" varchar(500),
	"body" text NOT NULL,
	"status" "message_status" DEFAULT 'queued' NOT NULL,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"read_at" timestamp,
	"error_message" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objection_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objection_text" text NOT NULL,
	"primary_asset" varchar(200) NOT NULL,
	"resolution_confidence" integer NOT NULL,
	"suggested_response" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospect_objections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"objection_id" uuid NOT NULL,
	"status" varchar(30) DEFAULT 'raised' NOT NULL,
	"raised_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"resolution_notes" text
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"whatsapp_number" varchar(20),
	"telegram_username" varchar(100),
	"mailing_address" text,
	"date_of_birth" date,
	"spouse_name" varchar(200),
	"spouse_email" varchar(255),
	"investable_capital" numeric(15, 2) NOT NULL,
	"annual_income" numeric(15, 2),
	"current_advisor" varchar(200),
	"current_fee_pct" numeric(5, 2),
	"investment_experience" "investment_experience",
	"risk_tolerance" "risk_tolerance",
	"ten_year_goal" text,
	"target_monthly_income" numeric(15, 2),
	"source" "source" NOT NULL,
	"source_detail" text,
	"temperature" "temperature" DEFAULT 'warm' NOT NULL,
	"lead_score" integer,
	"stage" "stage" DEFAULT 'outreach' NOT NULL,
	"stage_entered_at" timestamp DEFAULT now() NOT NULL,
	"founding_vs_standard" "founding_status" DEFAULT 'undecided' NOT NULL,
	"custom_plan_sent" boolean DEFAULT false NOT NULL,
	"custom_plan_date" date,
	"next_follow_up" date,
	"estimated_close_date" date,
	"estimated_aum" numeric(15, 2),
	"notes" text,
	"lost_reason" varchar(50),
	"lost_reason_detail" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_section_id_checklist_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."checklist_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_views" ADD CONSTRAINT "link_views_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_views" ADD CONSTRAINT "link_views_link_sent_id_links_sent_id_fk" FOREIGN KEY ("link_sent_id") REFERENCES "public"."links_sent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links_sent" ADD CONSTRAINT "links_sent_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links_sent" ADD CONSTRAINT "links_sent_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_batches" ADD CONSTRAINT "message_batches_template_id_message_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."message_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_batches" ADD CONSTRAINT "message_batches_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_sent" ADD CONSTRAINT "messages_sent_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_sent" ADD CONSTRAINT "messages_sent_template_id_message_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."message_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_sent" ADD CONSTRAINT "messages_sent_batch_id_message_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."message_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_sent" ADD CONSTRAINT "messages_sent_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospect_objections" ADD CONSTRAINT "prospect_objections_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospect_objections" ADD CONSTRAINT "prospect_objections_objection_id_objection_registry_id_fk" FOREIGN KEY ("objection_id") REFERENCES "public"."objection_registry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;