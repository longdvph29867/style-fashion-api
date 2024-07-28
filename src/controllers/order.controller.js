import httpStatus from "http-status";
import orderService from "../services/order.service.js";
import userService from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";
import { pickFilter, pickOption } from "../utils/pick.js";
import errorMessage from "../config/error.js";
import { paymentStatusValue } from "../constants/constant.js";
import { mapOrderStatuses } from "../utils/orderUtils.js";
import dotenv from "dotenv";
import axios from "axios";
import orderStatusService from "../services/orderStatus.service.js";
import cartService from "../services/cart.service.js";
import attributeService from "../services/attribute.service.js";
import productService from "../services/product/product.service.js";
import voucherService from "../services/voucher.service.js";
dotenv.config();

const handleCreateOrder = async (bodyOrder) => {
  const { user, productsOrder, voucherCode, historicalCost } = bodyOrder;
  const userData = await userService.getUserById(user);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const carts = await cartService.getCartsByIdUser(user);
  if (!carts || carts.products_cart.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "There are no products in your cart"
    );
  }
  const cartMap = new Map();
  carts.products_cart.forEach((itemCart) => {
    if (!itemCart.attribute) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "There an atrribute that are not in product"
      );
    }
    const key = `${itemCart.product._id.toString()}_${itemCart.attribute._id.toString()}`;
    cartMap.set(key, itemCart._id);
  });
  const productCartIds = productsOrder.map((itemOrder) => {
    const key = `${itemOrder.productId}_${itemOrder.attributeId}`;
    const getProductCartId = cartMap.get(key);
    if (!getProductCartId) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "There are products that are not in your cart."
      );
    }
    return getProductCartId;
  });
  const isProductOrderInProdcutsColection = productsOrder.map(
    async (itemOrder) => {
      const product = await productService.getProductByID(itemOrder.productId);
      if (!product) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "There an atrribute that are not in product"
        );
      }
    }
  );
  await Promise.all(isProductOrderInProdcutsColection);
  if (voucherCode !== "") {
    const isVoucher = await voucherService.checkVoucher(
      voucherCode,
      historicalCost
    );
    await voucherService.updateVoucherById(isVoucher.id, {
      quantity: isVoucher.quantity - 1,
    });
  }
  const order = await orderService.createOrder(bodyOrder);
  const documentAttribute = await Promise.all(
    order.productsOrder.map(async (orderItem) => {
      const attribute = await attributeService.getAttributeByID(
        orderItem.attributeId
      ); // Tìm kiếm attribute
      return {
        updateOne: {
          filter: { _id: attribute._id }, // Điều kiện lọc dựa trên _id
          update: { $set: { stock: attribute.stock - orderItem.quantity } }, // Cập nhật quantity
        },
      };
    })
  );

  await cartService.removeCartItemsByIds(user, productCartIds);
  await attributeService.updateAttributeMany(documentAttribute);
  return order;
};

const create = async (req, res) => {
  try {
    const order = await handleCreateOrder(req.body);
    res.status(httpStatus.CREATED).json(order);
  } catch (error) {
    errorMessage(res, error);
  }
};

const createVnpayOrder = async (req, res) => {
  try {
    const order = await handleCreateOrder(req.body);
    console.log(order);
    const urlData = await axios.post(
      `${process.env.BASE_API}/payments/create_payment_url`,
      {
        amount: order.totalPrice,
        orderCode: order.id,
        bankCode: "",
        language: "vn",
      }
    );
    res.status(httpStatus.CREATED).json({ url: urlData.data.url });
  } catch (error) {
    errorMessage(res, error);
  }
};

const vnpayOrderPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderByID(id);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }
    const urlData = await axios.post(
      `${process.env.BASE_API}/payments/create_payment_url`,
      // "http://localhost:8000/api/v1/payments/create_payment_url",
      {
        amount: order.totalPrice,
        orderCode: order.id,
        bankCode: "",
        language: "vn",
      }
    );
    res.status(httpStatus.CREATED).json({ url: urlData.data.url });
  } catch (error) {
    errorMessage(res, error);
  }
};

const getOrderByUserID = async (req, res) => {
  try {
    const { userID } = req.params;
    const filter = { ...pickFilter(req.query, ["orderCode"]), user: userID };
    const options = pickOption(req.query, ["sortBy", "limit", "page"]);
    const user = await userService.getUserById(userID);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const orders = await orderService.getOrders(filter, options);
    orders.results = mapOrderStatuses(orders.results);
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    errorMessage(res, error);
  }
};

const getAll = async (req, res) => {
  try {
    const filter = pickFilter(req.query, ["orderCode"]);
    const options = pickOption(req.query, ["sortBy", "limit", "page"]);
    const orders = await orderService.getOrders(filter, options);
    orders.results = mapOrderStatuses(orders.results);
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    errorMessage(res, error);
  }
};

const getDetail = async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await orderService.getOrderByID(orderID);
    const status = paymentStatusValue.find(
      (status) => status.code === order.orderStatus
    );
    res.status(httpStatus.OK).json({ ...order._doc, orderStatus: status });
  } catch (error) {
    errorMessage(res, error);
  }
};

const update = async (req, res) => {
  try {
    const { orderID } = req.params;
    const statusCode = req.body.orderStatus;
    const order = await orderService.getOrderByID(orderID);

    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy đơn hàng");
    }

    const orderStatus = await orderStatusService.queryOrderStatus();

    if (!orderStatus.find((status) => status.code === statusCode)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Trạng thái đơn hàng không khớp với hệ thống!"
      );
    }

    if (order.orderStatus === 9) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đơn hàng đang trong trạng thái hủy không thay đổi trạng thái đơn hàng"
      );
    }

    if (order.orderStatus === 8) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đơn hàng đã hoàn thành không thay đổi trạng thái đơn hàng"
      );
    }

    // if (
    //   (body.orderStatus !== 7 && order.orderStatus <= 2) ||
    //   order.orderStatus > 2
    // ) {
    //   if (
    //     body.orderStatus < order.orderStatus ||
    //     body.orderStatus > order.orderStatus + 1
    //   ) {
    //     throw new ApiError(
    //       httpStatus.BAD_REQUEST,
    //       "Không thể chuyển về trạng thái trước và trạng thái phải được thay đổi theo thứ tự"
    //     );
    //   }
    // }
    const updateOrder = await orderService.updateOrder(orderID, {
      orderStatus: statusCode,
    });
    if (updateOrder.orderStatus === 9) {
      const documentAttribute = await Promise.all(
        updateOrder.productsOrder.map(async (orderItem) => {
          const attribute = await attributeService.getAttributeByID(
            orderItem.attribute
          ); // Tìm kiếm attribute
          return {
            updateOne: {
              filter: { _id: attribute._id }, // Điều kiện lọc dựa trên _id
              update: { $set: { stock: attribute.stock + orderItem.quantity } }, // Cập nhật quantity
            },
          };
        })
      );
      await attributeService.updateAttributeMany(documentAttribute);
    }
    res.status(httpStatus.CREATED).json(updateOrder);
  } catch (error) {
    errorMessage(res, error);
  }
};

const orderController = {
  create,
  createVnpayOrder,
  vnpayOrderPayment,
  getOrderByUserID,
  getAll,
  getDetail,
  update,
};

export default orderController;
