const express = require('express');
const router = express.Router();
const ctrl = require('./media.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { createMediaSchema } = require('./media.validator');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Operasi untuk file attachment (Media)
 */

/**
 * @swagger
 * /media:
 *   get:
 *     summary: Ambil daftar media
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: taskId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan Task ID
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar media
 */
router.get('/', ctrl.listMedia);

/**
 * @swagger
 * /media:
 *   post:
 *     summary: Upload/Simpan informasi media baru
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileName, fileUrl, fileSize, mimeType, taskId]
 *             properties:
 *               fileName: { type: string, example: 'dokumen.pdf' }
 *               fileUrl: { type: string, example: 'https://storage.com/dokumen.pdf' }
 *               fileSize: { type: integer, example: 1024000 }
 *               mimeType: { type: string, example: 'application/pdf' }
 *               taskId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Media berhasil disimpan
 */
router.post('/', validate(createMediaSchema, 'body'), ctrl.createMedia);

/**
 * @swagger
 * /media/{id}:
 *   get:
 *     summary: Dapatkan detail media by ID
 *     tags: [Media]
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
 *         description: Detail media
 */
router.get('/:id', ctrl.getMedia);

/**
 * @swagger
 * /media/{id}:
 *   delete:
 *     summary: Hapus media
 *     tags: [Media]
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
 *         description: Media berhasil dihapus
 */
router.delete('/:id', ctrl.deleteMedia);

module.exports = router;
