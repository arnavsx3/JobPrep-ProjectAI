import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middleware.js";
import { generateInterviewReport } from "../controllers/interview-controller.js";
import { upload } from "../middlewares/multer-middleware.js";

const interviewRouter = Router();

/**
 * @route POST/api/interview
 * @description Generate new interview report on the basis of resume pdf, self description and job description
 * @access Private
 */
interviewRouter
  .route("/")
  .post(verifyJWT, upload.single("resume"), generateInterviewReport);

export { interviewRouter };
