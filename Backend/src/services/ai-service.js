import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ApiError } from "../utils/api-error.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const geminiSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
    },
    technicalQuestions: {
      type: Type.ARRAY,
      minItems: 5,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      minItems: 5,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: Type.ARRAY,
      minItems: 3,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skill", "severity"],
      },
    },
    prepPlan: {
      type: Type.ARRAY,
      minItems: 7,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          focus: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            minItems: 3,
            items: { type: Type.STRING },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
    title: {
      type: Type.STRING,
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "prepPlan",
    "title",
  ],
};

const zodIntReportSchema = z.object({
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(5),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(5),
  skillGaps: z
    .array(
      z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]),
      }),
    )
    .min(3),
  prepPlan: z
    .array(
      z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string()).min(3),
      }),
    )
    .min(7),
  title: z.string(),
});

export const genInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const prompt = `
  You are an AI interview coach. Analyze the candidate details and generate a structured interview preparation report.

  Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}

  Requirements:
  - matchScore: number between 0-100
  - technicalQuestions: at least 5 items with question, intention, and answer
  - behavioralQuestions: at least 5 items with question, intention, and answer (use STAR method for answers)
  - skillGaps: list missing skills, severity must be "low", "medium", or "high"
  - prepPlan: at least 7 days, each with a focus and minimum 3 tasks
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
    },
  });

  const raw = JSON.parse(response.text);
  const validated = zodIntReportSchema.safeParse(raw);
  if (!validated.success) {
    throw new ApiError(500, "Invalid response structure from Gemini");
  }
  return validated.data;
};
