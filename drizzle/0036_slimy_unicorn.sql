ALTER TABLE "tollow_text_favorites" ADD COLUMN "client_record_id" text;--> statement-breakpoint
UPDATE "tollow_text_favorites" SET "client_record_id" = "id" WHERE "client_record_id" IS NULL;--> statement-breakpoint
ALTER TABLE "tollow_text_favorites" ALTER COLUMN "client_record_id" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "tollow_favorites_user_client_uniq" ON "tollow_text_favorites" USING btree ("user_id","client_record_id");
