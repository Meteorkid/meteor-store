CREATE TABLE "pathfinder_item_notes" (
	"item_id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"what_happened" text NOT NULL,
	"why_it_matters" text NOT NULL,
	"skills" text DEFAULT '[]' NOT NULL,
	"suggested_action" text NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	"generated_at" text NOT NULL,
	"edited_by_human" boolean DEFAULT false NOT NULL,
	"reviewer_id" text,
	"reviewed_at" text,
	CONSTRAINT "pathfinder_item_notes_status_valid" CHECK ("pathfinder_item_notes"."status" in ('draft', 'approved'))
);
--> statement-breakpoint
CREATE INDEX "pathfinder_item_notes_status_idx" ON "pathfinder_item_notes" USING btree ("status");