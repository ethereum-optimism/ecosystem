DROP INDEX IF EXISTS "contracts_created_at_index";--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "chain_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "contract_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "deployer_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "deployment_tx_hash" varchar NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_entity_id_chain_id_contract_address_index" ON "contracts" ("entity_id","chain_id","contract_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_entity_id_created_at_index" ON "contracts" ("entity_id","created_at");