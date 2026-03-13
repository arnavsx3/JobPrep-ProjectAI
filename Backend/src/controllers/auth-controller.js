import bcrypt from "bcryptjs";
import { userModel } from "../models/user-model.js";
import { tokenBlackListModel } from "../models/blacklist-model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

/**
 * @name registerUserController
 * @description Register a new user
 * @access Public
 */
const registerUserController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  const registeredUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, "User registered successfully", registeredUser));
});

/**
 * @name loginUserController
 * @description Login a user
 * @access Public
 */
const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }
  const isPasswordValid = await bcrpyt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  const loggedInUser = await userModel.findById(user._id).select("-password");
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, "User logged in", loggedInUser));
});

const logoutUserController = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new ApiError(401, "Unauthorized access");
  }
  if (token) {
    await tokenBlackListModel.create({ token });
  }
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };
  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, "User logged out"));
});

/**
 * @name getMeController
 * @description Get current logged-in user details
 * @access Private
 */
const getMeController = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched", user));
});

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
