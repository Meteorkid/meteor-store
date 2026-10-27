CREATE TABLE "software_license_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"source_license_id" text NOT NULL,
	"product_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"kind" text NOT NULL,
	"source_type" text NOT NULL,
	"granted_at" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "software_license_codes_code_unique" UNIQUE("code"),
	CONSTRAINT "software_codes_product_check" CHECK ("software_license_codes"."product_id" IN ('xnook', 'xisland')),
	CONSTRAINT "software_codes_kind_check" CHECK ("software_license_codes"."kind" IN ('monthly', 'annual', 'lifetime')),
	CONSTRAINT "software_codes_source_check" CHECK ("software_license_codes"."source_type" IN ('order', 'invite', 'gift'))
);
--> statement-breakpoint
CREATE TABLE "software_license_devices" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"device_id" text NOT NULL,
	"device_name" text NOT NULL,
	"email" text,
	"token_hash" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"activated_at" text NOT NULL,
	"last_seen_at" text NOT NULL,
	"revoked_at" text,
	CONSTRAINT "software_devices_status_check" CHECK ("software_license_devices"."status" IN ('active', 'revoked'))
);
--> statement-breakpoint
CREATE TABLE "software_license_trials" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"device_id" text NOT NULL,
	"started_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "software_license_codes" ADD CONSTRAINT "software_license_codes_source_license_id_license_keys_id_fk" FOREIGN KEY ("source_license_id") REFERENCES "public"."license_keys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "software_codes_source_product_idx" ON "software_license_codes" USING btree ("source_license_id","product_id");--> statement-breakpoint
CREATE INDEX "software_codes_email_product_idx" ON "software_license_codes" USING btree ("email","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "software_devices_product_device_idx" ON "software_license_devices" USING btree ("product_id","device_id");--> statement-breakpoint
CREATE INDEX "software_devices_owner_idx" ON "software_license_devices" USING btree ("email","product_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "software_trials_product_device_idx" ON "software_license_trials" USING btree ("product_id","device_id");