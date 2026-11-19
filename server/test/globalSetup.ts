import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { TestProject } from 'vitest/node';

let client: Client;
let container: StartedPostgreSqlContainer;

export async function setup(project: TestProject) {
  container = await new PostgreSqlContainer('postgres:17').start();
  const connectionUri = container.getConnectionUri();

  client = new Client({ connectionString: connectionUri });
  await client.connect();

  const db = drizzle({ client });

  await migrate(db, { migrationsFolder: './src/database/migrations' });

  project.provide('connectionUri', connectionUri);
}

export async function teardown() {
  await client.end();
  await container.stop();
}

declare module 'vitest' {
  export interface ProvidedContext {
    connectionUri: string;
  }
}
