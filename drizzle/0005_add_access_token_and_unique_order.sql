ALTER TABLE "orders" ADD COLUMN "access_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_order_id_unique" UNIQUE("order_id");