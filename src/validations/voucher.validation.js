import Joi from "joi";
import { objectId } from "./custom.validation.js";

const createVoucher = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    validFrom: Joi.date().required(),
    validTo: Joi.date().required().greater(Joi.ref("validFrom")).messages({
      "date.greater": "validTo must be greater than validFrom",
    }),
    discount: Joi.number().required(),
    minCartPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    type: Joi.string().valid("percentage", "amount").required(),
    exclude_promotions: Joi.boolean().required(),
  }),
};

const checkVoucher = {
  body: Joi.object().keys({
    code: Joi.string().required().trim(),
    cartPrice: Joi.number().required(),
  }),
};

const useVoucher = {
  body: Joi.object().keys({
    code: Joi.string().required().trim(),
    cartPrice: Joi.number().required(),
  }),
};

const getVouchers = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const updateVoucher = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    validFrom: Joi.date(),
    validTo: Joi.date().greater(Joi.ref("validFrom")).messages({
      "date.greater": "validTo must be greater than validFrom",
    }),
    discount: Joi.number(),
    minCartPrice: Joi.number(),
    quantity: Joi.number(),
    type: Joi.string().valid("percentage", "amount"),
    exclude_promotions: Joi.boolean(),
  }),
};
export { createVoucher, getVouchers, checkVoucher, useVoucher, updateVoucher };
