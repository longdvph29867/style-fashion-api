import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js";

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email already taken");
  }
  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Phone number already taken");
  }
  return await User.create(userBody);
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByPhoneNumber = async (phoneNumber) => {
  return User.findOne({ phoneNumber });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  if (
    updateBody.phoneNumber &&
    (await User.isPhoneNumberTaken(updateBody.phoneNumber, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // await User.findByIdAndUpdate(user.id);
  await User.findByIdAndUpdate(user.id, { active: false });
  return user;
};

const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
};

export default userService;
