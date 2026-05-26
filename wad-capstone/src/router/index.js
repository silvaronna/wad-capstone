const express = require("express");
const router = express.Router();
const { getHealth } = require("../controller/healthController");
router.get("/health", getHealth);

module.exports = router;