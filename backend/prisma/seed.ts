import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'AdminFirstName',
    lastName: 'AdminLadtName',
    email: 'admin@studigarage.io',
    saltedPassword: 'password1',
    role: 'ADMIN',
  },
  {
    firstName: 'Arnaud',
    lastName: 'Arditig',
    email: 'a.a@studigarage.io',
    saltedPassword: 'password2',
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
