import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { defineConfig } from "drizzle-kit";

loadEnvFileIfExist()

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema",
  out: "./src/database/migrations",
  dbCredentials: {
    host: required(process.env, 'POSTGRES_HOST'),
    port: requiredInt(process.env, 'POSTGRES_PORT'),
    user: required(process.env, 'POSTGRES_USER'),
    password: required(process.env, 'POSTGRES_PASSWORD'),
    database: required(process.env, 'POSTGRES_DB'),
    ssl: false,
  }
});

function required(env: typeof process.env, key: string): string {
  const value = env[key];

  if (value === undefined || value.trim() === "") throw new Error(`[${key}]: is a required environment variable`);

  return value;
}

function requiredInt(env: typeof process.env, key: string): number {
  const value = env[key];

  if (!Number.isInteger(Number(value))) throw new Error(`[${key}]: is a non-numerical value`);

  return Number(value);
}

function loadEnvFileIfExist(filePath: string = './.env') {
  if (existsSync(filePath)) {
    loadEnvFile(filePath);
  }
}