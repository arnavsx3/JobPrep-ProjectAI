import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { genInterviewReport } from "../services/ai-service.js";
import { interviewReportModel } from "../models/intReport-model.js";
import { PDFParse } from "pdf-parse";

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

export { generateInterviewReport };
