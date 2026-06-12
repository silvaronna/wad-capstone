const prisma = require('../config/prisma');

const mediaRepository = {
  async findMany({ taskId, userId, limit = 10, offset = 0 } = {}) {
    const where = {};
    if (taskId) where.taskId = Number(taskId);
    if (userId) where.userId = Number(userId);

    const [data, total] = await Promise.all([
      prisma.attachment.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.attachment.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id) {
    return prisma.attachment.findUnique({
      where: { id: Number(id) },
      include: {
        task: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
    });
  },

  async create(data) {
    return prisma.attachment.create({
      data: {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: Number(data.fileSize),
        mimeType: data.mimeType,
        taskId: Number(data.taskId),
        userId: Number(data.userId),
      },
    });
  },

  async remove(id) {
    try {
      await prisma.attachment.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (e) {
      if (e.code === 'P2025') return false;
      throw e;
    }
  },

  async findByTask(taskId) {
    return prisma.attachment.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = mediaRepository;
