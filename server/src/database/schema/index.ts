import {
  primaryKey,
  pgEnum,
  uuid,
  timestamp,
  bigint,
  text,
  index,
  check,
  varchar,
  uniqueIndex,
  unique,
  foreignKey,
  snakeCase,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const urlVariantKindEnum = pgEnum('url_variant_kind', [
  'canonical',
  'redirect',
  'normalized',
]);
// export const visibilityEnum = pgEnum('visibility', ['public', 'private']);

export const users = snakeCase.table('users', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp({ precision: 0, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
});

export const pages = snakeCase.table(
  'pages',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    url: text().notNull().unique(),
  },
  (table) => [check('url_octet_length_check', sql`OCTET_LENGTH(${table.url}) <= 2048`)],
);

export const urlVariants = snakeCase.table(
  'url_variants',
  {
    url: text().primaryKey(),
    pageId: bigint({ mode: 'number' })
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    kind: urlVariantKindEnum().notNull(),
    createdAt: timestamp({ precision: 0, withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [check('url_octet_length_check', sql`OCTET_LENGTH(${table.url}) <= 2048`)],
);

export const userPages = snakeCase.table(
  'user_pages',
  {
    userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
    pageId: bigint({ mode: 'number' }).references(() => pages.id, { onDelete: 'restrict' }),
    folderId: uuid(),
    savedAt: timestamp({ precision: 0, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId, table.folderId],
      foreignColumns: [folders.userId, folders.id],
      name: 'user_pages_folder_fk',
    }).onDelete('set null'),
    primaryKey({ columns: [table.userId, table.pageId] }),
    index('idx_user_saved_at_page').on(table.userId, table.savedAt, table.pageId),
  ],
);

export const folders = snakeCase.table(
  'folders',
  {
    id: uuid().primaryKey().defaultRandom(),
    parentId: uuid(),
    name: varchar({ length: 255 }).notNull(), // Ограничения на minLength через Nest валидацию
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp({ precision: 0, withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId, table.parentId],
      foreignColumns: [table.userId, table.id],
      name: 'folders_parent_fk',
    }).onDelete('cascade'),
    unique('uniq_user_parent_name').on(table.userId, table.parentId, table.name).nullsNotDistinct(),
    uniqueIndex('idx_uniq_user_folder').on(table.userId, table.id),
  ],
);
