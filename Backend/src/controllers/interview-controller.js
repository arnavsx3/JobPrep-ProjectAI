import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { genInterviewReport } from "../services/ai-service.js";
import { interviewReportModel } from "../models/intReport-model.js";
import { PDFParse } from "pdf-parse";

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterviewReport = asyncHandler(async (req, res) => {
  const parser = new PDFParse({ data: req.file.buffer });
  const result = await parser.getText();
  const resumeContent = result.text;
  await parser.destroy();
  const { selfDescription, jobDescription } = req.body;
  const interviewReportByAi = await genInterviewReport({
    resume: resumeContent,
    selfDescription,
    jobDescription,
  });
  const interviewReport = await interviewReportModel.create({
    user: req.user._id,
    resume: resumeContent,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Interview report generated successfully",
        interviewReport,
      ),
    );
});

/**
 * @description Controller to get interview report by interviewId.
 */

const getInterviewReportById = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;
  const interViewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user._id,
  });
  if (!interViewReport) {
    throw new ApiError(404, "Interview report not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Interview report fetched successfully",
        interViewReport,
      ),
    );
});

/**
 * @description Controller to fetch all interview reports of logged in user,
 */
const getAllInterviewReports = asyncHandler(async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user._id,
    })
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -prepPlan");
  if (!interviewReports) {
    throw new ApiError(404, "Interview reports not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200,"Interview reports fetched successfully",interviewReports))
});

export { generateInterviewReport, getInterviewReportById, getAllInterviewReports };
