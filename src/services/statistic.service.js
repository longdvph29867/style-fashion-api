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

const topBestSellingProducts = async (startDate, endDate, orderStatus) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        orderStatus: orderStatus,
      },
    },
    {
      $unwind: "$productsOrder"
    },
    {
      $group: {
        _id: "$productsOrder.productId",
        productName: { $first: "$productsOrder.productName" },
        productImage: { $first: "$productsOrder.imageProduct" },
        totalQuantity: { $sum: "$productsOrder.quantity" }
      }
    },
    {
      $lookup: {
        from: "Products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        productName: { $ifNull: ["$productDetails.productName", "$productName"] },
        productImage: { $ifNull: ["$productDetails.imageProduct", "$productImage"] }
      }
    },
    {
      $sort: { totalQuantity: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$productName",
        productImage: "$productImage",
        totalQuantity: 1
      }
    }
  ]);
};

const getOrderStatusStatistics = async (startDate, endDate, orderStatus) => {
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
      $group: {
        _id: "$orderStatus",
        totalAmount: { $sum: "$totalPrice" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        orderStatus: "$_id",
        totalAmount: 1,
        count: 1
      }
    }
  ]);
};

const statisticService = {
  order,
  topBestSellingProducts,
  getOrderStatusStatistics,
};

export default statisticService;
