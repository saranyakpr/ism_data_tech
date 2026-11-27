import { Router } from "express";

import {
  getLifeAtISMPhotos,
  uploadLifeAtISMPhoto,
  updateLifeAtISMPhoto,
  deleteLifeAtISMPhoto,
} from "../controllers/life-at-ism-controller.js";

import { requireAdmin } from "../middleware/require-admin.js";
import { requireSameOrigin } from "../middleware/require-same-origin.js";
import { uploadImage } from "../middleware/upload-image.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getLifeAtISMPhotos);

router.post(
  "/",
  requireSameOrigin,
  uploadImage.single("image"),
  uploadLifeAtISMPhoto
);

router.patch(
  "/",
  requireSameOrigin,
  uploadImage.single("image"),
  updateLifeAtISMPhoto
);

router.delete(
  "/",
  requireSameOrigin,
  deleteLifeAtISMPhoto
);

export default router;