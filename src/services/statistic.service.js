import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js";
import Order from "../models/Order.model.js";

const order = async (startDate, endDate, groupFormat) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);
};

const statisticService = {
  order,
};

export default statisticService;
