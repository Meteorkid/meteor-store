CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"target_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_avatar" text,
	"content" text NOT NULL,
	"parent_id" text,
	"status" text DEFAULT 'approved' NOT NULL,
	"reviewed_at" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"product_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"memo" text,
	"expires_at" text,
	"created_by" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "invite_redemptions" (
	"id" text PRIMARY KEY NOT NULL,
	"invite_code_id" text NOT NULL,
	"user_id" text NOT NULL,
	"license_key" text NOT NULL,
	"redeemed_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"target_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "likes_target_id_user_id_pk" PRIMARY KEY("target_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" text PRIMARY KEY NOT NULL,
	"target_id" text NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "comments_target_idx" ON "comments" USING btree ("target_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "comments_status_idx" ON "comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invite_redemptions_code_idx" ON "invite_redemptions" USING btree ("invite_code_id");--> statement-breakpoint
CREATE INDEX "invite_redemptions_user_idx" ON "invite_redemptions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invite_redemptions_code_user_uniq" ON "invite_redemptions" USING btree ("invite_code_id","user_id");--> statement-breakpoint
CREATE INDEX "likes_target_idx" ON "likes" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "page_views_target_ip_uniq" ON "page_views" USING btree ("target_id","ip_hash");--> statement-breakpoint
CREATE INDEX "page_views_target_idx" ON "page_views" USING btree ("target_id");