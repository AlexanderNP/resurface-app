import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  workingDirectory: process.env.PWD || process.cwd(),
  port: parseInt(process.env.APP_PORT ?? '', 10),
}));
