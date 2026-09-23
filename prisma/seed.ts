import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role } from "../src/generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "alienchord.official@gmail.com";

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      role: Role.OWNER,
    },
    create: {
      email,
      name: "Alien Chord",
      role: Role.OWNER,
    },
  });

  console.log("OWNER verified:", user.email);
  console.log("Role:", user.role);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });