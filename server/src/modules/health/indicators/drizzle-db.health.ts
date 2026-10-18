import { sql } from "drizzle-orm";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { InjectDrizzle } from "../../../database/index.js";
import type { DrizzleDB } from "../../../database/index.js";

@Injectable()
export class DrizzleDBHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @InjectDrizzle()
    private readonly db: DrizzleDB,
  ) {}

  isHealthy(key: string) {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.db.execute(sql`select 1`);
        return { database: 'ok' };
      })
      .withTimeout(1000);
  }
}
