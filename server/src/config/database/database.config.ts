import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  name: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT ?? '', 10),
  host: process.env.POSTGRES_HOST
}));