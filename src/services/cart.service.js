import httpStatus from "http-status";

import ApiError from "../utils/ApiError.js";
import Carts from "../models/Cart.model.js";
import attributeService from "./product/attribute.service.js";

const getCartsByIdUser = async (user_id) => {
  return await Carts.findOne({ user: user_id }).populate([
    {
      path: "products_cart.product",
      model: "Products",
      select: "name slug thumbnail",
    },
    {
      path: "products_cart.attribute",
      model: "Attribute",
    },
  ]);
};

const addToCartByIdUser = async (user_ID, cartBody) => {
  let cart = {};
  cart = await Carts.findOne({ user: user_ID });
  if (!cart) {
    cart = await Carts.create({ user: user_ID });
  }
  const productIndex = cart.products_cart.findIndex(
    (item) =>
      item.product.toString() === cartBody.product &&
      item.attribute.toString() === cartBody.attribute
  );
  if (productIndex > -1) {
    const attribute = await attributeService.getAttributeByID(
      cartBody.attribute
    );
    if (!attribute) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Attribute not found");
    }
    cart.products_cart[productIndex].quantity += cartBody.quantity;
    if (cart.products_cart[productIndex].quantity > attribute.stock) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Quantity exceeds stock limit. Available stock: ${attribute.stock}`
      );
    }
  } else {
    cart.products_cart.unshift(cartBody);
  }
  await cart.save();

  return cart;
};

const updateCartByIdProductCart = async (userId, data) => {
  const cart = await Carts.findOneAndUpdate({ user: userId }, data, {
    new: true,
  });
  return cart;
};

const deleteProductCartById = async (user_id, product_cart_id) => {
  const cart = await Carts.findOne({ user: user_id });

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }
  const productIndex = cart.products_cart.findIndex(
    (product) => product._id.toString() === product_cart_id
  );
  if (productIndex !== -1) {
    cart.products_cart.splice(productIndex, 1);
    await cart.save();
  } else {
    throw new Error("Product not found in cart");
  }
};

const removeCartItemsByIds = async (user_id, productCartIds) => {
  console.log(productCartIds);
  const order = await Carts.updateOne(
    { user: user_id },
    { $pull: { products_cart: { _id: { $in: productCartIds } } } }
  );
  console.log(order);
};

const cartService = {
  getCartsByIdUser,
  addToCartByIdUser,
  updateCartByIdProductCart,
  deleteProductCartById,
  removeCartItemsByIds,
};
export default cartService;
