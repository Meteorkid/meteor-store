CREATE TABLE "license_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"email" text NOT NULL,
	"key" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "license_keys_key_unique" UNIQUE("key")
);
