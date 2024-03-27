// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// initialize Prisma Client
const prisma = new PrismaClient();
const fakerUser = (): any => ({
  // id: faker.number.bigInt(),
  name: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
});
const fakeBooking = () => {};
const fakeRoom = () => ({
  // id: faker.number.bigInt(),
  description: faker.lorem.sentences(5),
  regularPrice: faker.number.int(),
  discount: faker.number.float(),
  title: faker.lorem.lines(1),
  maxCapacity: 10,
  roomImage: '/default.png',
});
async function main() {
  // create fake users
  const fakerRounds = 10;
  console.log('Seeding...');
  /// --------- Users ---------------
  const users = [];
  const bookings = [];
  for (let i = 0; i < fakerRounds; i++) {
    users[i] = prisma.user.create({ data: fakerUser() });
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    const room = fakeRoom();

    bookings[i] = prisma.booking.create({
      data: {
        room: {
          create: fakeRoom(),
        },
        User: {
          create: fakerUser(),
        },
        startDate,
        endDate,
        numNights: 2,
        status: 'confirmed',
        totalPrice:
          (room.regularPrice - (room.regularPrice * room.discount) / 100) * 2,
      },
    });
  }
  await Promise.all([users, bookings]);
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
