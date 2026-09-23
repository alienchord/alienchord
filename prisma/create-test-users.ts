import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role } from "../src/generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      email: "alienchord.admin.test@gmail.com",
      name: "Test Admin",
      role: Role.ADMIN,
    },
    {
      email: "alienchord.editor.test@gmail.com",
      name: "Test Editor",
      role: Role.EDITOR,
    },
    {
      email: "alienchord.viewer.test@gmail.com",
      name: "Test Viewer",
      role: Role.VIEWER,
    },
  ];

  for (const data of users) {
    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        role: data.role,
        name: data.name,
      },
      create: data,
    });

    console.log(
      `Created/verified: ${user.email} → ${user.role}`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });