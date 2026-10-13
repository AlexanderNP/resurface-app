
import { plainToInstance } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { validateSync } from 'class-validator';

import AppEnv from './app/app.env.js';
import DatabaseEnv from './database/database.env.js';

export class EnvironmentVariables extends IntersectionType(
  AppEnv,
  DatabaseEnv,
) {}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
