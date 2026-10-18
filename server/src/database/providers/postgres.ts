import databaseConfig from "../../config/database/database.config.js";
import { ConfigType } from "@nestjs/config";
import { Logger, Provider } from "@nestjs/common";
import { PG_POOL } from "./inject-keys.js";
import { Pool } from "pg";

export const PostgresProvider = {
  provide: PG_POOL,
  useFactory: (
    dbConfig: ConfigType<typeof databaseConfig>,
  ): Pool => {
    const logger = new Logger('Database');
  
    const { host, user, password, name, port } = dbConfig;
  
    const pool = new Pool({
      host,
      user,
      password,
      port,
      database: name,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      logger.error(`[${err.name}]: ${err.message}`, err.stack);
    });

    return pool;
  },
  inject: [databaseConfig.KEY],
} satisfies Provider;
