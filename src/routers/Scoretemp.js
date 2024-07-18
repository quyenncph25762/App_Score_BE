import express from "express";
import ScoretempController from "../controllers/ScoretempController";
const router = express.Router();

router.post("/create-scoretemp", ScoretempController.createScoretemp);
router.patch("/:id/update-scoretemp", ScoretempController.updateScoretemp);
export default router;
