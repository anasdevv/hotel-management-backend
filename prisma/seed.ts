// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// initialize Prisma Client
const prisma = new PrismaClient();
const fakerUser = (): any => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});
async function main() {
  // create fake users
  const fakerRounds = 10;
  console.log('Seeding...');
  /// --------- Users ---------------
  const users = [];
  for (let i = 0; i < fakerRounds; i++) {
    users[i] = prisma.user.create({ data: fakerUser() });
  }
  await Promise.all(users);
  console.log(`generated ${fakerRounds} users`);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
