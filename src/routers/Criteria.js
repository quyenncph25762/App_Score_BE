import express from "express";
import CriteriaController from "../controllers/CriteriaController";
const router = express.Router();
router.get(
  "/get-ByScoretempId-criteria",
  CriteriaController.getByScoretemp_Criteria
);
router.get("/:id/getOne-citeria", CriteriaController.getOneCriteria);

//detail citieria

export default router;
