CREATE TABLE "masters_notices" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"round_id" text NOT NULL,
	"kind" text NOT NULL,
	"lead_days" integer,
	"date_version" integer NOT NULL,
	"created_at" text NOT NULL,
	"read_at" text,
	CONSTRAINT "masters_notices_kind_check" CHECK ("masters_notices"."kind" IN ('deadline', 'changed'))
);
--> statement-breakpoint
CREATE TABLE "masters_rounds" (
	"id" text PRIMARY KEY NOT NULL,
	"identity_key" text NOT NULL,
	"intake_year" integer NOT NULL,
	"region" text NOT NULL,
	"details" jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"verified_on" text,
	"revision" integer DEFAULT 1 NOT NULL,
	"date_version" integer DEFAULT 1 NOT NULL,
	"date_changed_at" text,
	"previous_deadline_text" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "masters_rounds_region_check" CHECK ("masters_rounds"."region" IN ('hong-kong', 'macau', 'singapore', 'uk', 'australia')),
	CONSTRAINT "masters_rounds_status_check" CHECK ("masters_rounds"."status" IN ('draft', 'published'))
);
--> statement-breakpoint
CREATE TABLE "masters_watches" (
	"user_id" text NOT NULL,
	"round_id" text NOT NULL,
	"status" text DEFAULT 'preparing' NOT NULL,
	"reminders" boolean DEFAULT false NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "masters_watches_user_id_round_id_pk" PRIMARY KEY("user_id","round_id"),
	CONSTRAINT "masters_watches_status_check" CHECK ("masters_watches"."status" IN ('preparing', 'submitted', 'abandoned'))
);
--> statement-breakpoint
CREATE INDEX "masters_notices_user_idx" ON "masters_notices" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "masters_rounds_identity_idx" ON "masters_rounds" USING btree ("identity_key");--> statement-breakpoint
CREATE INDEX "masters_rounds_year_status_idx" ON "masters_rounds" USING btree ("intake_year","status");--> statement-breakpoint
CREATE INDEX "masters_watches_round_idx" ON "masters_watches" USING btree ("round_id");