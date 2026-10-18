import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { DrizzleDBHealthIndicator } from "./indicators/drizzle-db.health.js";

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DrizzleDBHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.isHealthy('database'),
    ]);
  }
}
