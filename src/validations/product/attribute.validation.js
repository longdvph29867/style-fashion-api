import Joi from "joi";
import { valueAttributeSchema } from "./valueAttribute.validation.js";

export const attributeSchema = Joi.object({
  name: Joi.string().required(),
  values: Joi.array().items(valueAttributeSchema).min(1).max(20).required(),
});
