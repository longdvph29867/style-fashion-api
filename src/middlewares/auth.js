import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import { roleRights } from "../config/roles.js";
import userService from "../services/user.service.js";

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
      }

      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
      }

      const decoded = await verifyToken(token);
      const user = await userService.getUserById(decoded.sub);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }
      req.user = user;
      if (requiredRights.length) {
        const userRights = roleRights.get(req.user.role);
        const hasRequiredRights = requiredRights.every((requiredRight) =>
          userRights.includes(requiredRight)
        );
        if (!hasRequiredRights && req.params.userId !== req.user.id) {
          throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
