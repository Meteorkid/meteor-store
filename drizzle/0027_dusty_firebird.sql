DROP INDEX "comments_status_idx";--> statement-breakpoint
DROP INDEX "reports_status_idx";--> statement-breakpoint
CREATE INDEX "comments_status_created_idx" ON "comments" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reports_status_created_idx" ON "reports" USING btree ("status","created_at");