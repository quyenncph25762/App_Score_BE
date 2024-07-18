import express from "express";
import ScoretempController from "../controllers/ScoretempController";
const router = express.Router();

router.post("/create-scoretemp", ScoretempController.createScoretemp);
router.patch("/:id/update-scoretemp", ScoretempController.updateScoretemp);

router.get("/getAll-scoretemp", ScoretempController.getAllScoretemp);
router.get("/getOne-scoretemp", ScoretempController.getOneScoretemp);

router.patch(
  "/:id/deleteOne-scoretemp",
  ScoretempController.deleteOne_Scoretemp
);
router.patch(
  "/deleteAll-selected-scoretemp",
  ScoretempController.deleteAll_Selected
);
// restore
router.patch("/:id/restoreOne-scoretemp", ScoretempController.restoreOne_Scoretemp);
router.patch(
  "/restoreAll-selected-scoretemp",
  ScoretempController.restoreAll_Selected
);
export default router;
