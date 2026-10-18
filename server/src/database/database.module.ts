import databaseConfig from "../config/database/database.config.js";
import { Global, Inject, Module, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Pool } from "pg";
import { DRIZZLE, PG_POOL } from "./providers/inject-keys.js";
import { PostgresProvider } from "./providers/postgres.js";
import { DrizzleProvider } from "./providers/drizzle.js";

@Global()
@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [PostgresProvider, DrizzleProvider],
  exports: [DRIZZLE],
})
export class DrizzleModule implements OnModuleInit, OnApplicationShutdown {
  public readonly pool: Pool

  constructor(@Inject(PG_POOL) pool: Pool) {
    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    const client =  await this.pool.connect();

    try {
      await client.query('SELECT NOW()')
    } finally {
      client.release();
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
