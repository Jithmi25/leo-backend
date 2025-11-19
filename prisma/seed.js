const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create sample badges
  const badges = await prisma.badge.createMany({
    data: [
      {
        name: 'District Officer Crest',
        description: 'Awarded to district officers',
        imageUrl: '/badges/officer-crest.png',
        criteria: 'Serve as a district officer'
      },
      {
        name: 'Past President',
        description: 'Awarded to past club presidents',
        imageUrl: '/badges/past-president.png',
        criteria: 'Complete term as club president'
      },
      {
        name: 'Eco Hero',
        description: 'Awarded for environmental service',
        imageUrl: '/badges/eco-hero.png',
        criteria: 'Participate in 5+ environmental projects'
      }
    ],
    skipDuplicates: true,
  });

  console.log('Created badges:', badges);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });