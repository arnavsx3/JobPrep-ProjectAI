import { userModel } from "../models/user-model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import { tokenBlackListModel } from "../models/blacklist-model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const isBlackListed = await tokenBlackListModel.findOne({ token });
    if (isBlackListed) {
      throw new ApiError(401, "Token expired. Please login again");
    }
    const user = await userModel
      .findById(decodedToken?._id)
      .select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

export { verifyJWT };
