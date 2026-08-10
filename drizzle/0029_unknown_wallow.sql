CREATE TABLE "blog_images" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"object_key" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	"uploaded_at" text,
	CONSTRAINT "blog_images_size_range" CHECK ("blog_images"."size_bytes" between 1 and 5000000),
	CONSTRAINT "blog_images_status_valid" CHECK ("blog_images"."status" in ('allocating', 'reserved', 'ready'))
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "blog_image_bytes" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_images_object_key_idx" ON "blog_images" USING btree ("object_key");--> statement-breakpoint
CREATE INDEX "blog_images_user_idx" ON "blog_images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "blog_images_status_updated_idx" ON "blog_images" USING btree ("status","updated_at");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_blog_image_bytes_non_negative" CHECK ("users"."blog_image_bytes" >= 0);