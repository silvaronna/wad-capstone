// File: src/config/prisma.js
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { URL } = require("url");

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
});

// Singleton: satu instance untuk seluruh aplikasi
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

// Disconnect saat aplikasi ditutup
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
