ALTER TABLE "users" ADD COLUMN "wechat_openid" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "wechat_unionid" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_wechat_openid_unique" UNIQUE("wechat_openid");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_wechat_unionid_unique" UNIQUE("wechat_unionid");