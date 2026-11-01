-- Custom SQL migration file, put your code below! --
ALTER TABLE "user_pages" DROP CONSTRAINT "user_pages_folder_fk";
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_folder_fk"
  FOREIGN KEY ("user_id", "folder_id") REFERENCES "folders" ("user_id", "id")
  ON DELETE SET NULL ("folder_id");