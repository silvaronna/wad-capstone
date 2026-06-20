// File: src/routes/index.js
const express = require('express');
const router = express.Router();

// Import semua sub-router
const authRoutes = require('./auth.routes');
const tasksRoutes = require('./tasks.routes');
const usersRoutes = require('./users.routes');
const adminRoutes = require('./admin.routes');

// Pasang prefix global /api/v1 di sini untuk semua rumpun endpoint
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/tasks', tasksRoutes);
router.use('/api/v1/users', usersRoutes);
router.use('/api/v1/admin', adminRoutes);

module.exports = router;