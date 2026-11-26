CREATE TABLE "history" (
	"transaction_id" uuid PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;