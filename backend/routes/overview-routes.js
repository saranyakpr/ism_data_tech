import { Router } from "express";

import { getAdminOverview } from "../controllers/overview-controller.js";
import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getAdminOverview);

export default router;