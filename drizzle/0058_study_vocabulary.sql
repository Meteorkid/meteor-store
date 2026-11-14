CREATE TABLE "study_vocabulary" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_key" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"review_stage" integer DEFAULT 0 NOT NULL,
	"review_due_on" text NOT NULL,
	"review_interval_days" integer DEFAULT 1 NOT NULL,
	"last_reviewed_on" text,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "study_vocabulary_source_key_check" CHECK ("study_vocabulary"."source_key" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "study_vocabulary_snapshot_check" CHECK (jsonb_typeof("study_vocabulary"."snapshot") = 'object' AND octet_length("study_vocabulary"."snapshot"::text) <= 16384),
	CONSTRAINT "study_vocabulary_stage_check" CHECK ("study_vocabulary"."review_stage" BETWEEN 0 AND 5),
	CONSTRAINT "study_vocabulary_interval_check" CHECK ("study_vocabulary"."review_interval_days" = (ARRAY[1, 3, 7, 14, 30, 60])["study_vocabulary"."review_stage" + 1]),
	CONSTRAINT "study_vocabulary_revision_check" CHECK ("study_vocabulary"."revision" >= 1),
	CONSTRAINT "study_vocabulary_due_check" CHECK ("study_vocabulary"."review_due_on" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND "study_vocabulary"."review_due_on"::date::text = "study_vocabulary"."review_due_on"),
	CONSTRAINT "study_vocabulary_reviewed_check" CHECK ("study_vocabulary"."last_reviewed_on" IS NULL OR ("study_vocabulary"."last_reviewed_on" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND "study_vocabulary"."last_reviewed_on"::date::text = "study_vocabulary"."last_reviewed_on"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "study_vocabulary_user_source_idx" ON "study_vocabulary" USING btree ("user_id","source_key");--> statement-breakpoint
CREATE INDEX "study_vocabulary_user_due_idx" ON "study_vocabulary" USING btree ("user_id","review_due_on");--> statement-breakpoint
CREATE INDEX "study_vocabulary_user_created_idx" ON "study_vocabulary" USING btree ("user_id","created_at","id");