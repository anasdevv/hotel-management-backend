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
const fakeFoodItem = () => ({
  name: faker.lorem.words(2),
  picture: '/abc.png',
  price: faker.number.int({
    max: 100,
    min: 10,
  }),
  description: faker.lorem.lines(2),
});
async function main() {
  const fakerRounds = 10;
  console.log('Seeding...');
  const bookings = [];
  const rooms = [];
  const foodItems = [];
  const orders = [];
  const features = [];
  let i = 0;
  for (i = 0; i < fakerRounds; i++) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    const room = fakeRoom();
    foodItems[i] = prisma.foodItem.create({
      data: fakeFoodItem(),
    });
    bookings[i] = prisma.booking.create({
      data: {
        room: {
          create: room,
        },
        user: {
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
    features[i] = prisma.feature.create({
      data: {
        featureName: faker.lorem.word(),
      },
    });
    orders[i] = prisma.order.create({
      data: {
        // price is not correct
        totalPrice: 2000,
        items: {
          create: {
            quantity: 3,
            foodItem: {
              create: fakeFoodItem(),
            },
          },
        },
      },
    });
    rooms[i] = fakeRoom();
  }
  for (; i < 2 * fakerRounds; i++) {
    features[i] = prisma.feature.create({
      data: {
        featureName: faker.lorem.word(),
      },
    });
  }
  await Promise.all([
    ...bookings,
    ...rooms,
    ...foodItems,
    ...orders,
    ...features,
  ]);
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
