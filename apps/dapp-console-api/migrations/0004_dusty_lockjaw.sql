CREATE TABLE IF NOT EXISTS "transactions" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"contract_id" uuid,
	"chain_id" integer NOT NULL,
	"transaction_hash" varchar NOT NULL,
	"block_number" bigint NOT NULL,
	"from_address" varchar NOT NULL,
	"to_address" varchar,
	"contract_address" varchar,
	"gas_used" bigint NOT NULL,
	"gas_price" bigint NOT NULL,
	"blob_gas_price" bigint,
	"blob_gas_used" bigint,
	"transaction_type" varchar NOT NULL,
	"transaction_event" varchar,
	"max_fee_per_blob_gas" bigint,
	"value" bigint,
	"status" varchar NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "transactions_chain_id_transaction_hash_index" ON "transactions" ("chain_id","transaction_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_from_address_index" ON "transactions" ("from_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_to_address_index" ON "transactions" ("to_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_contract_address_index" ON "transactions" ("contract_address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
