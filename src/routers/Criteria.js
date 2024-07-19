import express from "express";
import CriteriaController from "../controllers/CriteriaController";
const router = express.Router();
router.get(
  "/:id/get-ByScoretempId-criteria",
  CriteriaController.getByScoretemp_Criteria
);
router.get("/:id/getOne-citeria", CriteriaController.getOneCriteria);

router.get(
  "/:id/getDetailCriteria_ByCriteriaId",
  CriteriaController.getDetailCriteria_ByCriteriaId
);
//detail citieria

export default router;
