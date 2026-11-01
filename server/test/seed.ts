import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seedUsers } from './fixtures/users.js';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT ?? '', 10),
  host: process.env.POSTGRES_HOST,
});

const drizzleDB = drizzle({ client: pool });

try {
  await seedUsers(drizzleDB);
} finally {
  await pool.end();
}
