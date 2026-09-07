ALTER TABLE "announcements" ADD COLUMN "source_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "announcements_source_key_idx" ON "announcements" USING btree ("source_key");