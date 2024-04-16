ALTER TABLE "deploymentRebates" ALTER COLUMN "rebate_amount" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "block_number" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "gas_used" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "gas_price" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "blob_gas_price" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "blob_gas_used" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "max_fee_per_blob_gas" SET DATA TYPE numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "value" SET DATA TYPE numeric(78, 0);