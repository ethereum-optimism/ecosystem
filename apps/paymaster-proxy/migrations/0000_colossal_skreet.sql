CREATE TABLE IF NOT EXISTS "sponsorship-policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_key_id" uuid NOT NULL,
	"chain_id" numeric(78, 0) NOT NULL,
	"provider_type" varchar NOT NULL,
	"provider_metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sponsorship-policies_api_key_id_index" ON "sponsorship-policies" ("api_key_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sponsorship-policies_chain_id_index" ON "sponsorship-policies" ("chain_id");