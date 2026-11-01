import { users } from '../../src/database/schema/index.js';
import type { DrizzleDB } from '../../src/database/index.js';

type NewUser = typeof users.$inferInsert;

export const TEST_USERS: NewUser[] = [
  {
    id: '6639a3fb-4c3c-4874-9273-e19bfa35d506',
  },
  {
    id: 'e963e11a-ad62-4aa4-af69-4f603ffd415a',
  },
];

export const seedUsers = async (db: DrizzleDB) => {
  await db.insert(users).values(TEST_USERS).onConflictDoNothing({ target: users.id });
};
