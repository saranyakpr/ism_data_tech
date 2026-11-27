import { Router } from "express";

import {
  downloadApplicationResume,
} from "../controllers/resume-controller.js";

import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();

router.use(requireAdmin);

router.get("/:id/resume", downloadApplicationResume);

export default router;