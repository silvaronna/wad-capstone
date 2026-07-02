const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const { hostname, port, username, password, pathname } = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: hostname,
  port: parseInt(port, 10) || 3306,
  user: username,
  password: password || undefined,
  database: pathname.slice(1),
  allowPublicKeyRetrieval: true
});
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      console.log('Database is empty. Seeding is required.');
      process.exit(2);
    } else {
      console.log('Database already has data. Skipping seed.');
      process.exit(0);
    }
  } catch (err) {
    console.error('Database connection or check failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
run();
