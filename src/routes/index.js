const express = require("express");
const routes = express.Router();
const { getHealth } = require("../controllers/healthController");
const { getInfo } = require("../controllers/infoController");
const { getEcho } = require("../controllers/echoController");
routes.get("/health", getHealth);
routes.get("/info", getInfo);
routes.get("/echo/:msg", getEcho);

module.exports = routes;
