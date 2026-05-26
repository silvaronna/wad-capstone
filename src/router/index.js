const express = require("express");
const router = express.Router();
const { getHealth } = require("../controller/healthController");
const { getInfo } = require("../controller/infoController");
const { getEcho } = require("../controller/echoController");
router.get("/health", getHealth);
router.get("/info", getInfo);
router.get("/echo/:msg", getEcho);

module.exports = router;