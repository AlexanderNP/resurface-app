CREATE TYPE "url_variant_kind" AS ENUM('canonical', 'redirect', 'normalized');--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_user_parent_name" UNIQUE NULLS NOT DISTINCT("user_id","parent_id","name")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"url" text NOT NULL UNIQUE,
	CONSTRAINT "url_octet_length_check" CHECK (OCTET_LENGTH("url") <= 2048)
);
--> statement-breakpoint
CREATE TABLE "url_variants" (
	"url" text PRIMARY KEY,
	"page_id" bigint NOT NULL,
	"kind" "url_variant_kind" NOT NULL,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "url_octet_length_check" CHECK (OCTET_LENGTH("url") <= 2048)
);
--> statement-breakpoint
CREATE TABLE "user_pages" (
	"user_id" uuid,
	"page_id" bigint,
	"folder_id" uuid,
	"saved_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_pages_pkey" PRIMARY KEY("user_id","page_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_uniq_user_folder" ON "folders" ("user_id","id");--> statement-breakpoint
CREATE INDEX "idx_user_saved_at_page" ON "user_pages" ("user_id","saved_at","page_id");--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_fk" FOREIGN KEY ("user_id","parent_id") REFERENCES "folders"("user_id","id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "url_variants" ADD CONSTRAINT "url_variants_page_id_pages_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_page_id_pages_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_folder_fk" FOREIGN KEY ("user_id","folder_id") REFERENCES "folders"("user_id","id") ON DELETE SET NULL;