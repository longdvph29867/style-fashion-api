import Order from "../models/Order.model.js";

const order = async (startDate, endDate, groupFormat, orderStatus) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        orderStatus,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
        totalAmount: { $sum: "$totalPrice" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

const statisticService = {
  order,
};

export default statisticService;
