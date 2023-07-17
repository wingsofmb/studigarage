import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'Vincent',
    lastName: 'Parrot',
    email: 'admin@studigarage.io',
    saltedPassword: '$2b$10$zVE5hN/C9cM9lPHqmoLR6.DZryv5.SR4vCcoHQ0o0FKw0q9PLKpnS', // 'P@ssword1',
    role: 'ADMIN',
  },
  {
    firstName: 'Arnaud',
    lastName: 'Arditig',
    email: 'employee1@studigarage.io',
    saltedPassword: '$2b$10$RybFoRKN8kNp2J3TD3X18OBUZYUCsuTmeC9xTsifIAaiy6NhWOkTq', // 'P@ssword2',
    role: 'EMPLOYEE',
  },
];

const repairServiceData: Prisma.RepairServiceCreateInput[] = [
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Changement d'huile et service de filtre` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Contrôle des fluides (liquide de frein, liquide de direction assistée, etc` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Changement et réparation des pneus` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Alignement et équilibrage des roues` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Réparation et remplacement des freins` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Remplacement des courroies et des chaînes de distribution` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Remplacement de la batterie` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Réparation et remplacement des systèmes d'échappement` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Réparation de la suspension et de la direction` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Services de climatisation et de chauffage` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Entretien du système de refroidissement / radiateur` },
  { theme: 'REPAIR_MAINTENANCE', price: 100, name: `Services de transmission (manuelle et automatique` },
  { theme: 'REVIEW', price: 120, name: `Le forfait de révision vidange basic` },
  { theme: 'REVIEW', price: 170, name: `Le forfait de révision entretien total` },
  { theme: 'REVIEW', price: 200, name: `Le forfait de révision entretien intégral` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Diagnostics du moteur` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Tests d'émissions et contrôle de la pollution` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Diagnostics du système électrique` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Diagnostics de la transmission` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Diagnostics de freinage` },
  { theme: 'DIAGNOSTIC', price: 100, name: `Inspection générale du véhicule` },
  { theme: 'CAR_BODY_AND_PAINTING', price: 100, name: `Réparation de bosses et de rayures` },
  { theme: 'CAR_BODY_AND_PAINTING', price: 100, name: `Remplacement et réparation de pare-brise` },
  { theme: 'CAR_BODY_AND_PAINTING', price: 100, name: `Peinture complète du véhicule` },
  { theme: 'CAR_BODY_AND_PAINTING', price: 100, name: `Retouches de peinture` },
  { theme: 'CAR_BODY_AND_PAINTING', price: 100, name: `Réparation et remplacement de pièces de carrosserie` },
  { theme: 'OTHER', price: 100, name: `Installation d'accessoires et d'améliorations (attelages de remorque, systèmes audio, etc.)` },
  { theme: 'OTHER', price: 100, name: `Vente de pièces de rechange` },
  { theme: 'OTHER', price: 100, name: `Vente de pneus` },
  { theme: 'OTHER', price: 100, name: `Achat et vente de voitures d'occasion` },
  { theme: 'OTHER', price: 100, name: `Service de courtage automobile pour l'achat de nouveaux véhicules` },
  { theme: 'ADMIN', price: 100, name: `Assistance pour les procédures d'assurance` },
  { theme: 'ADMIN', price: 100, name: `Aide pour les formalités d'immatriculation et de contrôle technique` },
  { theme: 'ADMIN', price: 100, name: `Service de remorquage` },
];

const timeTableData: Prisma.TimetableCreateInput[] = [
  { day: 'MONDAY', businessHour: '9h - 19h' },
  { day: 'TUESDAY', businessHour: '9h - 19h' },
  { day: 'WEDNESDAY', businessHour: '9h - 19h' },
  { day: 'THURSDAY', businessHour: '9h - 19h' },
  { day: 'FRIDAY', businessHour: '9h - 19h' },
  { day: 'SATURDAY', businessHour: '9h - 18h' },
  { day: 'SUNDAY', businessHour: '10h - 14h' },
];

const settingData: Prisma.SettingCreateInput[] = [{ address: '25 rue de la chaumière, 75012 Paris', phone: '+33 1 02 03 04 05' }];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const s of repairServiceData) {
    const service = await prisma.repairService.create({ data: s });
    console.log(`Created repairService with id: ${service.id}`);
  }
  for (const t of timeTableData) {
    const timetable = await prisma.timetable.create({ data: t });
    console.log(`Created timetable with id: ${timetable.id}`);
  }
  for (const s of settingData) {
    const setting = await prisma.setting.create({ data: s });
    console.log(`Created setting with id: ${setting.id}`);
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
