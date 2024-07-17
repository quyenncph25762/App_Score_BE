import express from "express";
import CriteriaController from "../controllers/CriteriaController";
const router = express.Router();
router.get("/getAll-criteria", CriteriaController.getAllCriteria);
router.get("/:id/getOne-citeria", CriteriaController.getOneCriteria);

//detail citieria

export default router;
