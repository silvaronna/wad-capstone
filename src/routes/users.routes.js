// File: src/routes/users.routes.js (BARU)
const express = require("express");
const router = express.Router();
const { getTasksByUser } = require("../controllers/tasks.controller");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operasi terkait user
 */

/**
 * @swagger
 * /users/{userId}/tasks:
 *   get:
 *     summary: Ambil semua task milik user tertentu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar task user
 */
router.get("/:userId/tasks", getTasksByUser);
module.exports = router;
