import { Router } from "express";

import {
  getJobs,
  createJob,
  updateJob,
} from "../controllers/jobs-controller.js";

import { requireAdmin } from "../middleware/require-admin.js";
import { requireSameOrigin } from "../middleware/require-same-origin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getJobs);
router.post("/", requireSameOrigin, createJob);
router.patch("/:id", requireSameOrigin, updateJob);

export default router;