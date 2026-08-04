ALTER TABLE "feedbacks" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "resolver_id" text;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "resolved_at" text;