import Joi from "joi";
import { objectId } from "../custom.validation.js";
import { attributeSchema } from "./attribute.validation.js";

export const getProducts = {
  query: Joi.object().keys({
    categories: Joi.string(),
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
export const getProductDetail = {
  params: Joi.object().keys({
    identifier: Joi.required(),
  }),
};

// export const createProduct = {
//   body: Joi.object().keys({
//     name: Joi.string().required(),
//     thumbnail: Joi.string().required(),
//     categories: Joi.array().min(1).max(10).items(Joi.string().custom(objectId)),
//     attributes: Joi.array().items(attributeSchema).min(1).max(5).required(),
//     gallery: Joi.array().max(5).items(Joi.string().allow(null, "")),
//     description: Joi.string().required(),
//     video: Joi.string().allow(null, ""), // Allow null or empty string
//   }),
// };

export const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    thumbnail: Joi.string().required(),
    categories: Joi.array().min(1).max(10).items(Joi.string().custom(objectId)),
    attributes: Joi.array().items(attributeSchema).min(1).max(5).required(),
    gallery: Joi.array().max(5).items(Joi.string()),
    description: Joi.string().required(),
    shortDescription: Joi.string().required(),
    featured: Joi.boolean(),
    video: Joi.string(),
    variants: Joi.array()
      .items(
        Joi.object({
          tier_index: Joi.array().required(),
          currentPrice: Joi.number().required(),
          originalPrice: Joi.number().required(),
          stock: Joi.number().required(),
        })
      )
      .required(),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    thumbnail: Joi.string(),
    categories: Joi.array().min(1).max(10).items(Joi.string().custom(objectId)),
    gallery: Joi.array().min(1).max(9).items(Joi.string()),
    description: Joi.string(),
    shortDescription: Joi.string(),
    featured: Joi.boolean(),
    video: Joi.string(),
  }),
};

export const updateAttributeProduct = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    attributes: Joi.array().items(attributeSchema).min(1).max(5).required(),
    variants: Joi.array()
      .items(
        Joi.object({
          tier_index: Joi.array().required(),
          currentPrice: Joi.number().required(),
          originalPrice: Joi.number().required(),
          stock: Joi.number().required(),
        })
      )
      .required(),
  }),
};

export const deleteProduct = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
