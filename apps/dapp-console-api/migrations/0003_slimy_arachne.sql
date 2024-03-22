CREATE TABLE IF NOT EXISTS "contracts" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"chain_id" integer,
	"app_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"contract_address" varchar,
	"deployer_address" varchar,
	"state" varchar DEFAULT 'not_verified' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_entity_id_index" ON "contracts" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_app_id_index" ON "contracts" ("app_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_contract_address_index" ON "contracts" ("contract_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_deployer_address_index" ON "contracts" ("deployer_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addresses_entity_id_index" ON "addresses" ("entity_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
