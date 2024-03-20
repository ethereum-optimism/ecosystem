CREATE TABLE IF NOT EXISTS "addresses" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"address" varchar NOT NULL,
	"verifications" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"state" varchar DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "addresses_entity_id_address_index" ON "addresses" ("entity_id","address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addresses_entity_id_index" ON "addresses" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addresses_address_index" ON "addresses" ("address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
