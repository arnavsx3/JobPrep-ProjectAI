import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck-controller.js";

const hcRouter = Router();

hcRouter.route("/hc").get(healthCheck)

export {hcRouter}