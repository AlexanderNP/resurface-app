import { getTableName, is, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../src/database/schema/index.js';

export async function truncateAll(db: NodePgDatabase) {
  const tables = Object.values(schema)
    .filter((t) => is(t, PgTable))
    .map((t) => `"${getTableName(t)}"`);

  await db.execute(sql.raw(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY;`));
}
