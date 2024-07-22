import httpStatus from "http-status";
import errorMessage from "../config/error.js";
import voucherService from "../services/voucher.service.js";
import ApiError from "../utils/ApiError.js";

const getAll = async (req, res) => {
  try {
    //   const filter = pickOption(req.query, ["name", "role"]);
    //   const options = pickOption(req.query, ["sortBy", "limit", "page"]);
    const result = await voucherService.queryVouchers({}, {});
    res.send(result);
  } catch (err) {
    errorMessage(res, err);
  }
};

const create = async (req, res) => {
  try {
    const data = await voucherService.create(req.body);
    res.status(httpStatus.CREATED).send(data);
  } catch (err) {
    errorMessage(res, err);
  }
};

const checkVoucher = async (req, res) => {
  const { code, cartPrice } = req.body;
  try {
    const voucher = await voucherService.checkVoucher(code, cartPrice);
    let discountAmount;
    if (voucher.type === "percentage") {
      discountAmount = (cartPrice * voucher.discount) / 100;
    } else if (voucher.type === "amount") {
      discountAmount = voucher.discount;
    }
    return res.send({
      message: "Voucher is valid",
      voucher,
      discountAmount: Math.min(discountAmount, cartPrice),
    });
  } catch (err) {
    errorMessage(res, err);
  }
};

const useVoucher = async (req, res) => {
  const { code, cartPrice } = req.body;
  try {
    const voucher = await voucherService.checkVoucher(code, cartPrice);
    const newData = await voucherService.updateVoucherById(voucher.id, {
      quantity: voucher.quantity - 1,
    });
    res.send(newData);
  } catch (err) {
    errorMessage(res, err);
  }
};

const update = async (req, res) => {
  try {
    const date = await voucherService.updateVoucherById(
      req.params.id,
      req.body
    );
    res.send(date);
  } catch (err) {
    errorMessage(res, err);
  }
};

const voucherCotroller = {
  create,
  useVoucher,
  getAll,
  update,
  checkVoucher,
};

export default voucherCotroller;
