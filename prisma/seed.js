import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { username: "demo_user" },
    update: {},
    create: { username: "demo_user" }
  });

  await prisma.transaction.deleteMany({
    where: { userId: user.id }
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        amount: "4200.00",
        type: "income",
        category: "Salary",
        description: "Monthly salary",
        date: new Date("2026-02-01T00:00:00.000Z")
      },
      {
        userId: user.id,
        amount: "250.00",
        type: "income",
        category: "Freelance",
        description: "Logo design project",
        date: new Date("2026-02-05T00:00:00.000Z")
      },
      {
        userId: user.id,
        amount: "1200.00",
        type: "expense",
        category: "Rent",
        description: "Apartment rent",
        date: new Date("2026-02-03T00:00:00.000Z")
      },
      {
        userId: user.id,
        amount: "320.75",
        type: "expense",
        category: "Groceries",
        description: "Weekly groceries",
        date: new Date("2026-02-10T00:00:00.000Z")
      },
      {
        userId: user.id,
        amount: "89.99",
        type: "expense",
        category: "Utilities",
        description: "Internet bill",
        date: new Date("2026-02-12T00:00:00.000Z")
      }
    ]
  });

  console.log(`Seeded demo data for user: ${user.username} (${user.id})`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
