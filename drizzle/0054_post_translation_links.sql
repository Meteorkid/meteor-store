ALTER TABLE "posts" ADD COLUMN "translation_of_id" text;--> statement-breakpoint
CREATE INDEX "posts_translation_of_idx" ON "posts" USING btree ("translation_of_id");