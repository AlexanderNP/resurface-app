import appConfig from '../config/app/app.config.js';
import databaseConfig from '../config/database/database.config.js';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validation.js';
import { DrizzleModule } from '../database/index.js';
import { HealthModule } from '../modules/health/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      envFilePath: './.env',
      validate,
    }),
    DrizzleModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
