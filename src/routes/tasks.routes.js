// File: src/routes/tasks.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tasks.controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { checkTaskOwnership } = require("../middleware/checkOwnership");
const {
  createTaskSchema,
  replaceTaskSchema,
  updateTaskSchema,
  listTasksSchema,
} = require("../validators/task.validator");
router.use(authenticate);
// GET /api/v1/tasks — Semua user bisa lihat (tapi filtered by userId di controller)
router.get("/", validate(listTasksSchema, "query"), ctrl.listTasks);
// POST /api/v1/tasks — USER dan ADMIN bisa buat task
router.post(
  "/",
  validate(createTaskSchema),
  authorize("USER", "ADMIN"),
  ctrl.createTask,
);
// GET /api/v1/tasks/:id — User bisa lihat task sendiri, admin lihat semua
router.get("/:id", checkTaskOwnership, ctrl.getTask);
// PATCH /api/v1/tasks/:id — Hanya pemilik atau admin
router.patch(
  "/:id",
  checkTaskOwnership,
  validate(updateTaskSchema),
  ctrl.updateTask,
);
// DELETE /api/v1/tasks/:id — Hanya pemilik atau admin
router.delete("/:id", checkTaskOwnership, ctrl.deleteTask);

const { sanitizeBody } = require("../middleware/sanitize");
// POST — validate → sanitize → create
router.post(
  "/",
  validate(createTaskSchema),
  sanitizeBody,
  authorize("USER", "ADMIN"),
  ctrl.createTask,
);
// PATCH — ownership → validate → sanitize → update
router.patch(
  "/:id",
  checkTaskOwnership,
  validate(updateTaskSchema),
  sanitizeBody,
  ctrl.updateTask,
);

module.exports = router;
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ambil daftar task dengan pagination, filtering, dan sorting
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman (maks 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Jumlah data yang dilewati
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar task
 */
router.get("/", validate(listTasksSchema, "query"), ctrl.listTasks);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Buat task baru
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */
router.post("/", validate(createTaskSchema, "body"), ctrl.createTask);
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Ambil detail task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail task ditemukan
 *       404:
 *         description: Task tidak ditemukan
 */
router.get("/:id", ctrl.getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Ganti seluruh data task (Replace)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task berhasil diperbarui
 */
router.put("/:id", validate(replaceTaskSchema, "body"), ctrl.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update sebagian data task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task berhasil diperbarui
 */
router.patch("/:id", validate(updateTaskSchema, "body"), ctrl.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Hapus task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task berhasil dihapus
 */
router.delete("/:id", ctrl.deleteTask);
module.exports = router;
