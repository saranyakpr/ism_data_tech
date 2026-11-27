import { Router } from "express";

import { getApplications } from "../controllers/applications-controller.js";
import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getApplications);

export default router;