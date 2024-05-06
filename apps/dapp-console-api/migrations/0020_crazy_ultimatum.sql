DROP INDEX IF EXISTS "transactions_chain_id_transaction_hash_index";--> statement-breakpoint
DROP INDEX IF EXISTS "transactions_from_address_index";--> statement-breakpoint
DROP INDEX IF EXISTS "transactions_to_address_index";--> statement-breakpoint
DROP INDEX IF EXISTS "transactions_contract_address_index";--> statement-breakpoint
DROP INDEX IF EXISTS "transactions_entity_id_block_timestamp_index";--> statement-breakpoint
ALTER TABLE "deploymentRebates" ALTER COLUMN "verified_wallets" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "deploymentRebates" ADD COLUMN "deployment_tx_hash" varchar NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "deploymentRebates_deployment_tx_hash_chain_id_index" ON "deploymentRebates" ("deployment_tx_hash","chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_entity_id_index" ON "transactions" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_contract_id_index" ON "transactions" ("contract_id");