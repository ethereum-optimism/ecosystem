ALTER TABLE "addresses" RENAME TO "wallets";--> statement-breakpoint
ALTER TABLE "wallets" DROP CONSTRAINT "addresses_entity_id_entities_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "addresses_entity_id_address_index";--> statement-breakpoint
DROP INDEX IF EXISTS "addresses_entity_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "addresses_address_index";--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "link_type" varchar DEFAULT 'privy' NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "unlinked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "disabled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "sanctioned_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wallets_entity_id_address_index" ON "wallets" ("entity_id","address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallets_entity_id_index" ON "wallets" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallets_address_index" ON "wallets" ("address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
