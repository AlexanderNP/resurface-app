import { Inject } from '@nestjs/common';
import { DRIZZLE } from "../providers/inject-keys.js"

export function InjectDrizzle(): ReturnType<typeof Inject> {
  return Inject(DRIZZLE);
}