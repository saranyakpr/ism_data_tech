import { Router } from "express";

import {
  adminLogin,
  adminLogout,
} from "../controllers/auth-controller.js";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);

export default router;