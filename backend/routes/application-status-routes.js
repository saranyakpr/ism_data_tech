import { Router } from "express";

import {
  updateApplicationStatus,
} from "../controllers/application-status-controller.js";

import { requireAdmin } from "../middleware/require-admin.js";
import { requireSameOrigin } from "../middleware/require-same-origin.js";

const router = Router();

router.use(requireAdmin);

router.patch("/:id", requireSameOrigin, updateApplicationStatus);

export default router;