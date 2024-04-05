CREATE TABLE IF NOT EXISTS "names" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"owner" varchar NOT NULL,
	"addresses" jsonb NOT NULL,
	"contenthash" varchar,
	"text" jsonb
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "names_name_index" ON "names" ("name");