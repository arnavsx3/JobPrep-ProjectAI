import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db/database.js";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

import { resume, selfDescription, jobDescription } from "./services/temp.js";
import { genInterviewReport } from "./services/ai-service.js";

genInterviewReport({ resume, selfDescription, jobDescription });
