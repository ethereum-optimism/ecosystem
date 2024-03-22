CREATE TABLE IF NOT EXISTS "apps" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"chain_id" integer,
	"name" varchar NOT NULL,
	"state" varchar DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apps_entity_id_index" ON "apps" ("entity_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apps" ADD CONSTRAINT "apps_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
