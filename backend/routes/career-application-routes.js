import { Router } from "express";

import {
  submitCareerApplication,
} from "../controllers/career-application-controller.js";

const router = Router();

router.post("/", submitCareerApplication);

export default router;