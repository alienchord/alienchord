import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const emails = [
  "alienchord.admin.test@gmail.com",
  "alienchord.editor.test@gmail.com",
  "alienchord.viewer.test@gmail.com",
];

async function main() {
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  console.log(`Deleted test users: ${result.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });