CREATE TABLE IF NOT EXISTS "api-keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"key" varchar NOT NULL,
	"state" varchar NOT NULL,
	"state_updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api-keys_deleted_at_index" ON "api-keys" ("deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api-keys_entity_id_deleted_at_index" ON "api-keys" ("entity_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "api-keys_key_index" ON "api-keys" ("key");