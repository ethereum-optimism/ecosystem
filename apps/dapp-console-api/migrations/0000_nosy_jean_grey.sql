CREATE TABLE IF NOT EXISTS "entities" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"privy_did" varchar NOT NULL,
	"state" varchar DEFAULT 'active' NOT NULL,
	"disabled_at" timestamp with time zone,
	CONSTRAINT "entities_privy_did_unique" UNIQUE("privy_did")
);
