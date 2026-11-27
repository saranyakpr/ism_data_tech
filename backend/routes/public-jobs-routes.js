import { Router } from "express";
import {
  getPublishedJobs,
  getPublishedJobById,
} from "../controllers/public-jobs-controller.js";

const router = Router();

router.get("/", getPublishedJobs);
router.get("/:id", getPublishedJobById);

export default router;