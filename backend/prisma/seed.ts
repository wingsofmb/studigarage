import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'AdminFirstName',
    lastName: 'AdminLadtName',
    email: 'admin@studigarage.io',
    saltedPassword: '$2b$10$zVE5hN/C9cM9lPHqmoLR6.DZryv5.SR4vCcoHQ0o0FKw0q9PLKpnS', // 'P@ssword1',
    role: 'ADMIN',
  },
  {
    firstName: 'Arnaud',
    lastName: 'Arditig',
    email: 'a.a@studigarage.io',
    saltedPassword: '$2b$10$RybFoRKN8kNp2J3TD3X18OBUZYUCsuTmeC9xTsifIAaiy6NhWOkTq', // 'P@ssword2',
    role: 'EMPLOYEE',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
