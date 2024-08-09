import express from "express";
import validate from "../middlewares/validate.js";
import cartController from "../controllers/cart.controller.js";
import { addToCart, deleteProductCart, getCart, updateProductCart } from "../validations/cart.validation.js";
import { auth } from "../middlewares/auth.js";
const cartRouter = express.Router();

cartRouter.get(
  "/",
  // auth("manageCarts"),
  validate(getCart),
  cartController.getCart
);
cartRouter.post(
  "/",
  // auth("manageCarts"),
  validate(addToCart),
  cartController.addToCart
);
cartRouter.put("/", validate(updateProductCart), cartController.updateCart);
cartRouter.delete("/", auth("manageCarts"), validate(deleteProductCart), cartController.remove);
export default cartRouter;

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API operations related to carts
 */
/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get cart by user id
 *     description: Only admins can retrieve all carts.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: user ID
 *     responses:
 *       '200':
 *         description: The list of the user
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Update a categories
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The id of the carts to be add to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - attribute
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *               attribute:
 *                 type: string
 *               quantity:
 *                 type: number
 *           example:
 *             product: "Object ID"
 *             attribute: "Object ID"
 *             quantity: "String"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /carts:
 *   put:
 *     summary: Update a categories
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The id of the carts to be add to cart
 *       - in: query
 *         name: cartItemId
 *         required: true
 *         description: The id of the carts to be add to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *           example:
 *             quantity: 0
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /carts:
 *   delete:
 *     summary: Update a categories
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The id of the carts to be add to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productCartId
 *             properties:
 *               productCartId:
 *                 type: string
 *           example:
 *             productCartId: "Object ID"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */
