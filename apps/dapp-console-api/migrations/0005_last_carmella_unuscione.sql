CREATE TABLE IF NOT EXISTS "deploymentRebates" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"contract_id" uuid NOT NULL,
	"contract_address" varchar NOT NULL,
	"chain_id" integer NOT NULL,
	"state" varchar DEFAULT 'pending_approval' NOT NULL,
	"rejection_reason" varchar,
	"rebate_tx_hash" varchar,
	"rebate_amount" bigint,
	"recipient_address" varchar
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deploymentRebates_entity_id_index" ON "deploymentRebates" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deploymentRebates_contract_id_index" ON "deploymentRebates" ("contract_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deploymentRebates_contract_address_chain_id_index" ON "deploymentRebates" ("contract_address","chain_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deploymentRebates" ADD CONSTRAINT "deploymentRebates_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deploymentRebates" ADD CONSTRAINT "deploymentRebates_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
