DROP INDEX IF EXISTS "deploymentRebates_contract_address_chain_id_index";--> statement-breakpoint
ALTER TABLE "deploymentRebates" ALTER COLUMN "state" SET DEFAULT 'pending_send';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "deploymentRebates_contract_address_chain_id_index" ON "deploymentRebates" ("contract_address","chain_id");