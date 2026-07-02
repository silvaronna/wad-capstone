const prisma = require("../config/prisma");

const getHealth = async (req, res) => {
  const io = req.app.get("io");
  
  let dbStatus = "unhealthy";
  try {
    // Simple query to verify database connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "healthy";
  } catch (error) {
    console.error("Database health check failed:", error.message);
  }

  const isHealthy = dbStatus === "healthy";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "error",
    database: dbStatus,
    socketIO: !!io,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
