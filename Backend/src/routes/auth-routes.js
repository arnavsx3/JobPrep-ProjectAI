import { Router } from "express";
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  getMeController
} from "../controllers/auth-controller.js";
import { verifyJWT } from "../middlewares/auth-middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.route("/register").post(registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user
 * @access Public
 */
authRouter.route("/login").post(loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout user
 * @access Public
 */
authRouter.route("/logout").get(logoutUserController);

/**
 * @route POST /api/auth/get-me
 * @description Get user profile
 * @access Private
 */
authRouter.route("/get-me").get(verifyJWT,getMeController);



export { authRouter };
