import { Router } from "express";
import { explainController, tutorChatController } from "../controllers/aiController.js";

const router = Router();

router.post("/explain", explainController);
router.post("/chat", tutorChatController);

export default router;
