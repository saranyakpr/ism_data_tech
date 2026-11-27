import { Router } from "express";

import {
  getPublicLifeAtISMPhotos,
} from "../controllers/public-life-at-ism-controller.js";

const router = Router();

router.get("/", getPublicLifeAtISMPhotos);

export default router;