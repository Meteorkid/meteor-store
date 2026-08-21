CREATE INDEX IF NOT EXISTS "license_keys_email_created_idx" ON "license_keys" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_user_status_idx" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_email_status_idx" ON "orders" USING btree ("email","status");