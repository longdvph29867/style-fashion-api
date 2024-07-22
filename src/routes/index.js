import express from "express";
import categoryRouter from "./category.router.js";
import routerUser from "./user.route.js";
import routerAuth from "./auth.route.js";
import routerImages from "./image.route.js";
import cartRouter from "./cart.router.js";
import productRouter from "./product.route.js";
import routerVideos from "./video.route.js";
import routerComment from "./comment.route.js";
import routerAddress from "./address.route.js";
import routerReview from "./review.route.js";
import orderRouter from "./order.route.js";
import routerCity from "./City/city.route.js";
import routerDistrict from "./City/district.route.js";
import routerWard from "./City/ward.route.js";
import routerPayment from "./payment.route.js";
import productTypeRouter from "./productType.router.js";
import routerOrderStatus from "./orderStatus.route.js";
import routerVoucher from "./voucher.route.js";
const routes = express.Router();

routes.use("/categories", categoryRouter);
routes.use("/users", routerUser);
routes.use("/auth", routerAuth);
routes.use("/images", routerImages);
routes.use("/videos", routerVideos);
routes.use("/carts", cartRouter);
routes.use("/products", productRouter);
routes.use("/comments", routerComment);
routes.use("/shipping-address", routerAddress);
routes.use("/reviews", routerReview);
routes.use("/cities", routerCity);
routes.use("/districts", routerDistrict);
routes.use("/wards", routerWard);

routes.use("/orders", orderRouter);
routes.use("/payments", routerPayment);
routes.use("/product-type", productTypeRouter);
routes.use("/order-status", routerOrderStatus);
routes.use("/vouchers", routerVoucher);

export default routes;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *       example:
 *         id: 5ebac534954b54139806c112
 *         name: Thời trang
 *         slug: thoi-trang
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         shippingAddress:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Address'
 *         role:
 *           type: string
 *         isEmailVerified:
 *           type: boolean
 *         isPhoneNumberVerified:
 *           type: boolean
 *       example:
 *         name: Mừng Lolicon
 *         image: https://www.google.com/image
 *         password: 123*****
 *         email: mungloli@gmail.com
 *         phoneNumber: 0912345678
 *         shippingAddress: [{ id: 5ebac534954b54139806c112, recipientName: Mừng loli, recipientPhoneNumber: 0912345678, streetAddress: Cổng số 1, Tòa nhà FPT Polytechnic, 13 phố Trịnh Văn Bô, wardCommune: Phương Canh, district: Nam Từ Liêm, cityProvince: Hà Nội}]
 *         role: user
 *         isEmailVerified: true
 *         isPhoneNumberVerified: fasle
 *
 *     Token:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: string
 *         type:
 *           type: string
 *           enum: [access, refresh, resetPassword, verifyEmail]
 *         expires:
 *           type: string
 *           format: date-time
 *         blacklisted:
 *           type: boolean
 *       example:
 *         id: 5ebac534954b54139806c112
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *         user: 5ebac534954b54139806c112
 *         type: access
 *         expires: 2024-05-19T12:30:45Z
 *         blacklisted: false
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         recipientName:
 *           type: string
 *         recipientPhoneNumber:
 *           type: string
 *         streetAddress:
 *           type: string
 *         wardCommune:
 *           type: string
 *         district:
 *           type: string
 *         cityProvince:
 *           type: string
 *       example:
 *         id: 5ebac534954b54139806c112
 *         recipientName: Mừng loli
 *         recipientPhoneNumber: 0912345678
 *         streetAddress: Cổng số 1, Tòa nhà FPT Polytechnic, 13 phố Trịnh Văn Bô
 *         wardCommune: Phương Canh
 *         district: Nam Từ Liêm
 *         cityProvince: Hà Nội
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         thumbnail:
 *           type: string
 *         attirbutes:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Attribute'
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         gallery:
 *           type: string
 *         video:
 *           type: string
 *       example:
 *         id: 5ebac534954b54139806c112
 *         name: Áo dài
 *         slug: ao-dai
 *         thumbnail: https://pos.nvncdn.com/87a693-52032/ps/20221222_Boj72UOgjLy3DubzkVy1gJW2.jpg
 *         attirbutes: [name:"Đỏ - XL", price:299000, stock:99,discont:0,image:https://pos.nvncdn.com/87a693-52032/ps/20221222_Boj72UOgjLy3DubzkVy1gJW2.jpg]
 *
 *     Attribute:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         discount:
 *           type: number
 *         image:
 *           type: string
 *       example:
 *         id: 5ebac534954b54139806c112
 *         name: Đỏ - XL
 *         price: 299000
 *         stock: 99
 *         discont: 0
 *         image: https://pos.nvncdn.com/87a693-52032/ps/20221222_Boj72UOgjLy3DubzkVy1gJW2.jpg
 *
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         products_cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 *               attribute:
 *                 $ref: '#/components/schemas/Attribute'
 *       example:
 *         id: 66515cbd3fad211cb0c90946
 *         user: 66497d8f4f4928b722bc2832
 *          products_cart:[{id:664b7e060974b7124167bbb6,name:"Áo trẻ em",gallery:["https://pos.nvncdn.com/87a693-52032/ps/20221222_Boj72UOgjLy3DubzkVy1gJW2.jpg"],attribute:["664f5defc3bf8f919eabae7f"],categories:["6651510420d6d5fd691a6823"],description:"Vải pique mịn, nhẹ Được làm từ hỗn hợp cotton...",video:"gdgfdg",active:true}]
 *         quantity: 2
 *          attribute:{id:664f5defc3bf8f919eabae7f,name:"Đỏ - L",price:299000, stock:99,discount:0,image:"https://pos.nvncdn.com/87a693-52032/ps/20221222_Boj72UOgjLy3DubzkVy1gJW2.jpg"}
 *
 *
 *     Orders:
 *       type: object
 *       properties:
 *         productsOrder:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               price:
 *                 type: number
 *                 minimum: 1
 *               productName:
 *                 type: string
 *               slug:
 *                 type: string
 *               imageProduct:
 *                 type: string
 *               imageAtrribute:
 *                 type: string
 *               attribute:
 *                 type: string
 *           required: true
 *         shippingAddress:
 *           type: object
 *           properties:
 *             recipientName:
 *               type: string
 *             recipientPhoneNumber:
 *               type: string
 *             streetAddress:
 *               type: string
 *             wardCommune:
 *               type: string
 *             district:
 *               type: string
 *             cityProvince:
 *               type: string
 *           required: true
 *         historicalCost:
 *           type: number
 *         salePrice:
 *           type: number
 *           default: 0
 *         shippingFee:
 *           type: number
 *         note:
 *           type: string
 *           default: ""
 *         totalPrice:
 *           type: number
 *         paymentMethod:
 *           type: string
 *           enum: [VNPAY, COD]
 *         paymentId:
 *           type: string
 *         voucher:
 *           type: string
 *       example:
 *         user: "66497d8f4f4928b722bc2832"
 *         productsOrder:
 *           - productId: "66515cbd3fad211cb0c90946"
 *             productName: "Product 2"
 *             slug: "product-2"
 *             imageProduct: "https://example.com/images/product2.jpg"
 *             imageAtrribute: "https://example.com/images/attribute2.jpg"
 *             quantity: 1
 *             price: 50.0
 *             attribute: "Red - M"
 *         shippingAddress:
 *           recipientName: "John Doe"
 *           recipientPhoneNumber: "123456789"
 *           streetAddress: "123 Main St"
 *           wardCommune: "Ward 1"
 *           district: "District 1"
 *           cityProvince: "City A"
 *         historicalCost: 350
 *         salePrice: 300
 *         shippingFee: 50
 *         note: "Please deliver between 9 AM and 5 PM"
 *         totalPrice: 350
 *         paymentMethod: "VNPAY"
 *         paymentId: "60d0fe4f5311236168a109cc"
 *         voucher: "60d0fe4f5311236168a109cd"
 */
