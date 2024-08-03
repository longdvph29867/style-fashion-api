import { Router } from "express";
import usersController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import statisticCotroller from "../controllers/statistic.controller.js";
import { orderStatusStatistics, statisticOrder } from "../validations/statistic.validation.js";

const routerStatistic = Router();
routerStatistic.get(
  "/order",
  //   auth("manageUsers"),
    validate(statisticOrder),
  statisticCotroller.order
);
routerStatistic.get(
  "/top-selling-product",
  //   auth("manageUsers"),
    validate(statisticOrder),
  statisticCotroller.topBestSellingProducts
);
routerStatistic.get(
  "/order-status",
  //   auth("manageUsers"),
    validate(orderStatusStatistics),
  statisticCotroller.orderStatusStatistics
);
export default routerStatistic;

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API operations related to statistic
 */

/**
 * @swagger
 * /statistics/order:
 *   get:
 *     summary: Get order statistic
 *     description: Only admins can retrieve all statistic.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: week, month, year
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Time
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Year
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: number
 *         description: order status
 *     responses:
 *       '200':
 *         description: The list of the statistic
 *         content:
 *           application/json:
 *             example: {}
 */


/**
 * @swagger
 * /statistics/top-selling-product:
 *   get:
 *     summary: Get order statistic
 *     description: Only admins can retrieve all statistic.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: week, month, year
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Time
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Year
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: number
 *         description: order status
 *     responses:
 *       '200':
 *         description: The list of the statistic
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /statistics/order-status:
 *   get:
 *     summary: Get order statistic
 *     description: Only admins can retrieve all statistic.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: week, month, year
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Time
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Year
 *     responses:
 *       '200':
 *         description: The list of the statistic
 *         content:
 *           application/json:
 *             example: {}
 */
