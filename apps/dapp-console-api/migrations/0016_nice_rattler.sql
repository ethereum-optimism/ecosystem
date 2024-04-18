ALTER TABLE "transactions" ADD COLUMN "max_fee_per_gas" numeric(78, 0);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "max_priority_fee_per_gas" numeric(78, 0);