CREATE TABLE IF NOT EXISTS "challenges" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"contract_id" uuid NOT NULL,
	"address" varchar NOT NULL,
	"state" varchar DEFAULT 'pending' NOT NULL,
	"challenge" jsonb,
	"reponse" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_entity_id_index" ON "challenges" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_contract_id_index" ON "challenges" ("contract_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_address_index" ON "challenges" ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_entity_id_address_index" ON "challenges" ("entity_id","address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
