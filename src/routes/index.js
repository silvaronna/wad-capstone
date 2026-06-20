// File: src/routes/index.js
const express = require('express');
const router = express.Router();

// Import semua sub-router
const authRoutes = require('./auth.routes');
const tasksRoutes = require('./tasks.routes');
const usersRoutes = require('./users.routes');
const adminRoutes = require('./admin.routes');
const mediaRoutes = require('../media/media.routes');
const { getHealth } = require('../controllers/healthController');
const { getInfo } = require('../controllers/infoController');
const { getEcho } = require('../controllers/echoController');

// Health Check Route
router.get('/health', getHealth);
router.get('/info', getInfo);
router.get('/echo/:msg', getEcho);

// Pasang prefix global /api/v1 di sini untuk semua rumpun endpoint
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/tasks', tasksRoutes);
router.use('/api/v1/users', usersRoutes);
router.use('/api/v1/admin', adminRoutes);
router.use('/api/v1/media', mediaRoutes);

module.exports = router;