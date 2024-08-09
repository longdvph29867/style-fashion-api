import Joi from "joi";
import { objectId } from "./custom.validation.js";

export const addToCart = {
  query: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
    variant: Joi.string().required().custom(objectId),
    quantity: Joi.number().min(1).required(),
  }),
};

export const updateProductCart = {
  query: Joi.object().keys({
    userId: Joi.required().custom(objectId),
    cartItemId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().min(1).required(),
  }),
};

export const getCart = {
  query: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

export const deleteProductCart = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    productCartId: Joi.string().required().custom(objectId),
  }),
};
