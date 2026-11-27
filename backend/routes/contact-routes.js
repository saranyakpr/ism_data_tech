import { Router } from "express";

import {
  submitContactEnquiry,
} from "../controllers/contact-controller.js";

const router = Router();

router.post("/", submitContactEnquiry);

export default router;