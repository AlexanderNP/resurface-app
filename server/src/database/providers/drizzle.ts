import { Pool } from "pg";
import { DRIZZLE, PG_POOL } from "./inject-keys.js";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Provider } from "@nestjs/common";
import { DrizzleDB } from "../types.js";

export const DrizzleProvider = {
  provide: DRIZZLE,
  useFactory: (
    pool: Pool,
  ): DrizzleDB =>  {
    const drizzleDB = drizzle({ client: pool });

    return drizzleDB;
  },
  inject: [PG_POOL],
} satisfies Provider;
