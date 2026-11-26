CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"balance" integer NOT NULL,
	"bank" text DEFAULT 'Loixrang Bank' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
