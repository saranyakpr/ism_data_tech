import { Router } from "express";

import {
  getLifeAtISMImage,
} from "../controllers/life-at-ism-image-controller.js";

const router = Router();

router.get("/:id/image", getLifeAtISMImage);

export default router;