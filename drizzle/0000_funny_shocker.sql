CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"email" text NOT NULL,
	"amount_cny" integer NOT NULL,
	"payment_method" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"alipay_trade_no" text,
	"paid_at" text,
	"created_at" text NOT NULL
);
