require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "WAD Capstone API",
  version: process.env.APP_VERSION || "1.0.0",
};
