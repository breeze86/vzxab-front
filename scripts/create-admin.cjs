const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();

const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const run = async () => {
  const username = process.argv[2];
  const displayName = process.argv[3];
  const password = process.argv[4];

  if (!username || !displayName || !password) {
    console.error(
      "Usage: node scripts/create-admin.cjs <username> <displayName> <password>"
    );
    process.exit(1);
  }

  const passwordHash = hashPassword(password);
  const admin = await prisma.admin.create({
    data: {
      username,
      displayName,
      passwordHash,
    },
  });

  console.log(`Admin created: ${admin.username} (${admin.displayName})`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
