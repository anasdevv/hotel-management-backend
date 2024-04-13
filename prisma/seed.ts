// // prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// // initialize Prisma Client
const prisma = new PrismaClient();
const fakerUser = (): any => ({
  name: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
});
const fakeRoom = () => ({
  description: faker.lorem.sentences(5),
  regularPrice: faker.number.int({
    max: 1000,
    min: 10,
  }),
  discount: faker.number.float({
    fractionDigits: 3,
  }),
  title: faker.lorem.lines(1),
  maxCapacity: 10,
  roomImage: '/default.png',
});
async function main() {
  const fakerRounds = 10;
  console.log('Seeding...');
  const bookings = [];
  for (let i = 0; i < fakerRounds; i++) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    const room = fakeRoom();
    bookings[i] = prisma.booking.create({
      data: {
        room: {
          create: room,
        },
        User: {
          create: fakerUser(),
        },
        startDate,
        endDate,
        numNights: 2,
        hasBreakfast: false,
        status: 'confirmed',
        totalPrice:
          (room.regularPrice - (room.regularPrice * room.discount) / 100) * 2,
      },
    });
  }
  await Promise.all(bookings);
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
