const Joi = require('joi');

const createMediaSchema = Joi.object({
  fileName: Joi.string().trim().max(255).required(),
  fileUrl: Joi.string().trim().uri().max(512).required(),
  fileSize: Joi.number().integer().positive().required(),
  mimeType: Joi.string().trim().max(100).required(),
  taskId: Joi.number().integer().positive().required(),
});

module.exports = {
  createMediaSchema,
};
