import Joi from "joi";
import { password, objectId, phoneNumber } from "./custom.validation.js";

const statisticOrder = {
  query: Joi.object().keys({
    time: Joi.string().required().custom((value, helpers) => {
      const { type } = helpers.state.ancestors[0];
      
      if (type === 'week') {
        if (value < 1 || value > 52) {
          return helpers.message('For "week", time must be between 1 and 52.');
        }
      } else if (type === 'month') {
        if (value < 1 || value > 12) {
          return helpers.message('For "month", time must be between 1 and 12.');
        }
      } else if (type === 'year') {
        const currentYear = new Date().getFullYear();
        if (value < 1000 || value > currentYear) {
          return helpers.message('For "year", time must be a valid year.');
        }
      }
      return value;
    }),
    year: Joi.string().required().custom((value, helpers) => {
      const currentYear = new Date().getFullYear();
      if (value < 2000 || value > currentYear) {
        return helpers.message('For "year", time must be a valid year.');
      }
      return value;
    }),
    orderStatus: Joi.number().required(),
    type: Joi.string()
      .required()
      .valid("week", "month", "year"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      image: Joi.string(),
      phoneNumber: Joi.string().custom(phoneNumber),
      role: Joi.string().valid("admin", "manager", "staff", "customer"),
    })
    .min(1),
};

const updateUserProfile = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      image: Joi.string(),
      phoneNumber: Joi.string().custom(phoneNumber),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export {
    statisticOrder,
  getUsers,
  getUser,
  updateUser,
  updateUserProfile,
  deleteUser,
};
