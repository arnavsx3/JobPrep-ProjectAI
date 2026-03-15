import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const zodIntReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description, based on their resume and self-description.",
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question asked during the interview."),
        intention: z
          .string()
          .describe("The intention behind asking the technical question."),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and how to structure the answer.",
          ),
      }),
    )
    .describe(
      "A list of technical questions asked during the interview, along with their intentions and the candidate's answers.",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question asked during the interview."),
        intention: z
          .string()
          .describe("The intention behind asking the behavioral question."),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and how to structure the answer.",
          ),
      }),
    )
    .describe(
      "A list of behavioral questions asked during the interview, along with their intentions and the candidate's answers.",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking based on the interview performance.",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, indicating how critical it is for the candidate to improve this skill.",
          ),
      }),
    )
    .describe(
      "A list of skill gaps identified during the interview, along with their severity levels.",
    ),

  prepPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number in the preparation plan, indicating the sequence of the preparation tasks.",
          ),
        focus: z
          .string()
          .describe("The main focus or topic for that day of preparation."),
        tasks: z
          .array(z.string())
          .describe(
            "A list of specific tasks or activities that the candidate should complete on that day to prepare for future interviews.",
          ),
      }),
    )
    .describe(
      "A detailed preparation plan for the candidate, outlining daily focuses and tasks to improve their interview performance.",
    ),
});

export const genInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const prompt = `Generate an interview report for a candidate according to the zod object schema given to you:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(zodIntReportSchema),
    },
  });
  console.log(JSON.parse(response.text));
};
