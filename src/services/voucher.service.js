import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import Voucher from "../models/Voucher.model.js";
import { generateCode } from "../utils/generateRandomCode.js";

const create = async (body) => {
  if (new Date(body.validFrom) >= new Date(body.validTo)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid date range");
  }

  let code;
  let isUnique = false;

  while (!isUnique) {
    code = generateCode(10);
    const existingVoucher = await Voucher.findOne({ code });
    if (!existingVoucher) {
      isUnique = true;
    }
  }
  body["code"] = code;
  return await Voucher.create(body);
};

const getVoucherByCode = async (code) => {
  return await Voucher.findOne({ code });
};
const getVoucherById = async (id) => {
  return await Voucher.findById(id);
};

const queryVouchers = async (filter, options) => {
  const data = await Voucher.paginate(filter, options);
  return data;
};

const updateVoucherById = async (id, updateData) => {
  const voucher = await Voucher.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voucher not found");
  }
  return voucher;
};

const checkVoucher = async (code, cartPrice) => {
  const voucher = await getVoucherByCode(code);
  if (!voucher || !voucher.active) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voucher not found");
  }
  const currentDate = new Date();
  if (currentDate < voucher.validFrom || currentDate > voucher.validTo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Voucher is not valid at this time"
    );
  }
  if (voucher.quantity <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Voucher is out of stock");
  }
  if (cartPrice < voucher.minCartPrice) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Minimum cart price to use this voucher is ${voucher.minCartPrice}`
    );
  }
  return voucher;
};

const deleteById = async (id) => {
  const data = await getVoucherById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voucher not found");
  }
  await Voucher.findByIdAndUpdate(data.id, { active: false });
  return data;
};

const voucherService = {
  create,
  queryVouchers,
  getVoucherByCode,
  getVoucherById,
  updateVoucherById,
  checkVoucher,
  deleteById,
};

export default voucherService;
