import { Router } from "express";
import { getAlgorithmController, getAlgorithmsController, simulateAlgorithmController } from "../controllers/algorithmController.js";

const router = Router();

router.get("/", getAlgorithmsController);
router.get("/:id", getAlgorithmController);
router.post("/:id/simulate", simulateAlgorithmController);

export default router;
