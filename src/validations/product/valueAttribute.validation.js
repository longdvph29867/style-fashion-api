import Joi from "joi";

export const valueAttributeSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
});
