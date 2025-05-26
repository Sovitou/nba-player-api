import Joi from "joi";

const playerQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow("").optional(),
  sortBy: Joi.string()
    .valid(
      "firstName",
      "lastName",
      "draftYear",
      "playerid",
      "position",
      "country",
      "school"
    )
    .default("lastName"),
  sortOrder: Joi.string().valid("asc", "desc").default("asc"),
});

const playerIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export { playerQuerySchema, playerIdSchema };
