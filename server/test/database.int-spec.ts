import { inject } from 'vitest';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { truncateAll } from './helpers.js';
import { pages } from '../src/database/schema/index.js';
import { seedUsers } from './fixtures/users.js';

describe('test truncated database', () => {
  const connection = inject('connectionUri');

  let pool: Pool;
  let db: NodePgDatabase;

  beforeEach(async () => {
    pool = new Pool({ connectionString: connection });
    db = drizzle({ client: pool });

    await truncateAll(db);
    await seedUsers(db);
  });

  it('test insert page with url', async () => {
    const urlToInsert = 'https://example.com/';

    await db.insert(pages).values({ url: urlToInsert });

    const result = await db
      .select({
        url: pages.url,
      })
      .from(pages);

    expect(result[0].url).toBe(urlToInsert);
  });

  it('test pages should be empty after truncate', async () => {
    const result = await db.select().from(pages);

    expect(result.length).toBe(0);
  });

  afterEach(async () => {
    await pool.end();
  });
});
