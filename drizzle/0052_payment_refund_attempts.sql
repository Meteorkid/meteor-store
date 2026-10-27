CREATE TABLE "payment_refund_attempts" (
	"request_no" text PRIMARY KEY NOT NULL,
	"payment_method" text NOT NULL,
	"order_id" text NOT NULL,
	"status" text NOT NULL,
	"source" text NOT NULL,
	"last_requested_at" text,
	"last_queried_at" text,
	"refund_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"refund_id" text,
	"needs_review" boolean DEFAULT false NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "payment_refund_status_check" CHECK ("payment_refund_attempts"."status" IN ('REQUESTING', 'PROCESSING', 'ABNORMAL', 'UNKNOWN', 'SUCCESS', 'CLOSED', 'REJECTED')),
	CONSTRAINT "payment_refund_source_check" CHECK ("payment_refund_attempts"."source" IN ('api', 'merchant', 'legacy')),
	CONSTRAINT "payment_refund_method_check" CHECK ("payment_refund_attempts"."payment_method" IN ('alipay', 'wechat')),
	CONSTRAINT "payment_refund_amount_check" CHECK ("payment_refund_attempts"."refund_amount" > 0 AND "payment_refund_attempts"."refund_amount" <= "payment_refund_attempts"."total_amount")
);
--> statement-breakpoint
ALTER TABLE "payment_refund_attempts" ADD CONSTRAINT "payment_refund_attempts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_refund_order_created_idx" ON "payment_refund_attempts" USING btree ("order_id","created_at");