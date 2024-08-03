import userService from "../services/user.service.js";
import httpStatus from "http-status";
import errorMessage from "../config/error.js";
import { pickOption } from "../utils/pick.js";
import ApiError from "../utils/ApiError.js";
import statisticService from "../services/statistic.service.js";
import moment from "moment";
import orderStatusService from "../services/orderStatus.service.js";

const order = async (req, res) => {
  try {
    const { type, time, year, orderStatus } = req.query;

    let startDate, endDate, groupFormat;

    switch (type) {
      case "week":
        startDate = moment().year(year).week(time).startOf("week").toDate();
        endDate = moment().year(year).week(time).endOf("week").toDate();
        groupFormat = "%Y-%m-%d";
        break;
      case "month":
        startDate = moment().year(year).month(time - 1).startOf("month").toDate();
        endDate = moment().year(year).month(time - 1).endOf("month").toDate();
        groupFormat = "%Y-%m-%d";
        break;
      case "year":
        startDate = moment().year(time).startOf("year").toDate();
        endDate = moment().year(time).endOf("year").toDate();
        groupFormat = "%Y-%m";
        break;
      default:
        return res.status(400).json({
          message: "Invalid type. Type must be week, month, or year.",
        });
    }
    const orderStatistics = await statisticService.order(startDate, endDate, groupFormat, Number(orderStatus));

    // Format orderStatistics to include all dates
    let formattedStatistics;
    if(type !== "year") {
      let currentDate = moment(startDate).startOf('day');
      const end = moment(endDate).endOf('day');
      const dates = [];
      while (currentDate <= end) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'days');
      }
      formattedStatistics = dates.map(date => {
        const stat = orderStatistics.find(stat => moment(stat._id).format('YYYY-MM-DD') === date);
        return {
          time: date,
          totalAmount: stat ? stat.totalAmount : 0,
          count: stat ? stat.count : 0
        };
      });
    }
    else {
      const months = Array.from({ length: 12 }, (_, i) => ({
        _id: `${year}-${String(i + 1).padStart(2, '0')}`,
        totalAmount: 0,
        count: 0
      }));
      formattedStatistics = months.map(month => {
        const stat = orderStatistics.find(stat => stat._id === month._id);
        
        return {
          time: month._id,
          totalAmount: stat ? stat.totalAmount : 0,
          count: stat ? stat.count : 0
        };
      });
    }

    res.send(formattedStatistics);
  } catch (err) {
    errorMessage(res, err);
  }
};

const topBestSellingProducts = async (req, res) => {
  try {
    const { type, time, year, orderStatus } = req.query;

    let startDate, endDate;

    switch (type) {
      case "week":
        startDate = moment().year(year).week(time).startOf("week").toDate();
        endDate = moment().year(year).week(time).endOf("week").toDate();
        break;
      case "month":
        startDate = moment().year(year).month(time - 1).startOf("month").toDate();
        endDate = moment().year(year).month(time - 1).endOf("month").toDate();
        break;
      case "year":
        startDate = moment().year(time).startOf("year").toDate();
        endDate = moment().year(time).endOf("year").toDate();
        break;
      default:
        return res.status(400).json({
          message: "Invalid type. Type must be week, month, or year.",
        });
    }
    const topBestSellingProducts = await statisticService.topBestSellingProducts(startDate, endDate, Number(orderStatus));
    res.send(topBestSellingProducts);
  } catch (err) {
    errorMessage(res, err);
  }
};

const orderStatusStatistics = async (req, res) => {
  try {
    const { type, time, year } = req.query;

    let startDate, endDate;

    switch (type) {
      case "week":
        startDate = moment().year(year).week(time).startOf("week").toDate();
        endDate = moment().year(year).week(time).endOf("week").toDate();
        break;
      case "month":
        startDate = moment().year(year).month(time - 1).startOf("month").toDate();
        endDate = moment().year(year).month(time - 1).endOf("month").toDate();
        break;
      case "year":
        startDate = moment().year(time).startOf("year").toDate();
        endDate = moment().year(time).endOf("year").toDate();
        break;
      default:
        return res.status(400).json({
          message: "Invalid type. Type must be week, month, or year.",
        });
    }

    const allStatuses = await orderStatusService.queryOrderStatus();
    const data = await statisticService.getOrderStatusStatistics(startDate, endDate);
    const statisticsMap = data.reduce((acc, stat) => {
      acc[stat.orderStatus] = stat;
      return acc;
    }, {});
  
    const result = allStatuses.map(status => {
      const statusId = status.code;
      return statisticsMap[statusId] ? {...statisticsMap[statusId], name: status.name} : {
        orderStatus: statusId,
        totalAmount: 0,
        count: 0,
        name: status.name,
      };
    });
    res.send(result);
  } catch (err) {
    errorMessage(res, err);
  }
};

const statisticCotroller = {
  order,
  topBestSellingProducts,
  orderStatusStatistics,
};

export default statisticCotroller;
