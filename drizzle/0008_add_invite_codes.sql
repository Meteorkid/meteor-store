-- 邀请码：invite_codes + invite_redemptions
--
-- 全部语句幂等，中断后可直接重跑。
-- 回滚：DROP TABLE IF EXISTS "invite_redemptions"; DROP TABLE IF EXISTS "invite_codes";

CREATE TABLE IF NOT EXISTS "invite_codes" (
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
CREATE TABLE IF NOT EXISTS "invite_redemptions" (
	"id" text PRIMARY KEY NOT NULL,
	"invite_code_id" text NOT NULL,
	"user_id" text NOT NULL,
	"license_key" text NOT NULL,
	"redeemed_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_redemptions_code_idx" ON "invite_redemptions" USING btree ("invite_code_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_redemptions_user_idx" ON "invite_redemptions" USING btree ("user_id");
