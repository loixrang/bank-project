ALTER TABLE "transaction" RENAME COLUMN "account_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;