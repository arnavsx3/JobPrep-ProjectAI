import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middleware.js";
import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
} from "../controllers/interview-controller.js";
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

/**
 * @route GET/api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access Private
 */
interviewRouter
  .route("/report/:interviewId")
  .get(verifyJWT, getInterviewReportById);

/**
 * @route GET/api/interview/
 * @description Get all interview reports of the logged in user
 * @access Private
 */
interviewRouter.route("/").get(verifyJWT, getAllInterviewReports);

export { interviewRouter };
