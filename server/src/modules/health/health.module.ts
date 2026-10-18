
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import { DrizzleDBHealthIndicator } from "./indicators/drizzle-db.health.js"

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
  providers: [DrizzleDBHealthIndicator]
})
export class HealthModule {}
