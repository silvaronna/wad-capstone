const mediaRepo = require('./media.repository');
const taskRepo = require('../repositories/task.repository');

const createMedia = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const userId = req.user.userId;

    // Verify task exists and belongs to user
    const task = await taskRepo.findById(taskId);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${taskId} tidak ditemukan.`,
        },
      });
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Anda tidak memiliki akses ke task ini.',
        },
      });
    }

    const media = await mediaRepo.create({
      ...req.body,
      userId,
    });

    const io = req.app.get("io");
    if (io) {
      io.to("tasks:global").emit("media:created", { media });
    }

    res.status(201).json({ data: media });
  } catch (err) {
    next(err);
  }
};

const listMedia = async (req, res, next) => {
  try {
    const { taskId, limit, offset } = req.query;
    const userId = req.user.userId;

    const { data, total } = await mediaRepo.findMany({
      taskId,
      userId,
      limit,
      offset,
    });

    res.status(200).json({
      data,
      pagination: {
        total,
        limit: Number(limit) || 10,
        offset: Number(offset) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMedia = async (req, res, next) => {
  try {
    const media = await mediaRepo.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Media ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }

    // Authorization check
    if (media.userId !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Anda tidak memiliki akses ke media ini.',
        },
      });
    }

    res.status(200).json({ data: media });
  } catch (err) {
    next(err);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    const media = await mediaRepo.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Media ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }

    // Authorization check
    if (media.userId !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Anda tidak memiliki akses ke media ini.',
        },
      });
    }

    await mediaRepo.remove(req.params.id);

    const io = req.app.get("io");
    if (io) {
      io.to("tasks:global").emit("media:deleted", { mediaId: Number(req.params.id), taskId: media.taskId });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMedia,
  listMedia,
  getMedia,
  deleteMedia,
};
