import express from "express";
import validate from "../middlewares/validate.js";
import productController from "../controllers/product.controller.js";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProducts,
  updateProduct,
} from "../validations/product/products.validation.js";
const cartRouter = express.Router();

cartRouter.get("/", validate(getProducts), productController.getAll);
cartRouter.get(
  "/:identifier",
  validate(getProductDetail),
  productController.getDetail
);
cartRouter.post("/", validate(createProduct), productController.create);
cartRouter.put("/:id", productController.update);
// cartRouter.put("/:id", validate(updateProduct), productController.update);
cartRouter.delete("/:id", validate(deleteProduct), productController.remove);
export default cartRouter;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API operations related to product
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all product
 *     description: Only admins can retrieve all product.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: find products by categoies
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       '200':
 *         description: The list of the user
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /products/{identifier}:
 *   get:
 *     summary: Get details of a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         description: The id or slug of the product
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - thumbnail
 *               - categories
 *               - description
 *               - attributes
 *               - variants
 *             properties:
 *               name:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               video:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     values:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           image:
 *                             type: string
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tier_index:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     currentPrice:
 *                       type: number
 *                     originalPrice:
 *                       type: number
 *                     stock:
 *                       type: integer
 *           example:
 *             name: "product name long"
 *             thumbnail: "thumbnail.png"
 *             categories: ["669e9334e80f375d88821538"]
 *             gallery: ["image.png"]
 *             featured: true
 *             description: "product description"
 *             shortDescription: "product shortDescription"
 *             video: "video.mp4"
 *             attributes:
 *               - name: "Size"
 *                 values:
 *                   - name: "S"
 *                     image: "value.jpg"
 *                   - name: "M"
 *                     image: "value2.jpg"
 *               - name: "Color"
 *                 values:
 *                   - name: "Red"
 *                   - name: "Green"
 *             variants:
 *               - tier_index: [0, 0]
 *                 currentPrice: 100
 *                 originalPrice: 10
 *                 stock: 10
 *               - tier_index: [0, 1]
 *                 currentPrice: 100
 *                 originalPrice: 10
 *                 stock: 20
 *               - tier_index: [1, 0]
 *                 currentPrice: 1000
 *                 originalPrice: 10
 *                 stock: 5
 *               - tier_index: [1, 1]
 *                 currentPrice: 100
 *                 originalPrice: 10
 *                 stock: 10
 *     responses:
 *       '200':
 *         description: Successfully created product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The product ID
 *               example:
 *                 id: "60d21b4667d0d8992e610c85"
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid request"
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The slug of the product to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categories
 *               - attributes
 *               - description
 *               - thumbnail
 *             properties:
 *               name:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: integer
 *                     stock:
 *                       type: integer
 *                     discount:
 *                       type: integer
 *                     image:
 *                       type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *           example:
 *             name: "String"
 *             thumbnail: "String"
 *             gallery:
 *               - "String"
 *             categories:
 *               - "Object Id"
 *             description: "String"
 *             video: "String"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to be deleted
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */
