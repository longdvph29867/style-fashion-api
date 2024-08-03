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

const topBestSellingProduct = {
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

const orderStatusStatistics = {
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
    type: Joi.string()
      .required()
      .valid("week", "month", "year"),
  }),
};

export {
    statisticOrder,
    topBestSellingProduct,
    orderStatusStatistics,
};
