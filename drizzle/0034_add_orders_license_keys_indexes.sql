CREATE INDEX "license_keys_email_created_idx" ON "license_keys" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "orders_user_status_idx" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "orders_email_status_idx" ON "orders" USING btree ("email","status");