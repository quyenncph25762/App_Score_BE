import express from "express";
import ScorefileController from "../controllers/ScorefileController";
const route = express.Router();

route.post("/create-scorefile", ScorefileController.create_Scorefile);
route.get("/get-scorefile", ScorefileController.getScorefile_ByEmployeeId);
route.get("/:id/getone-scorefile", ScorefileController.getOne_Scorefile);
route.patch("/:id/update-scorefile", ScorefileController.update_Scorefile);

route.patch("/:id/delete-scorefile", ScorefileController.deleteOne_Scorefile);
route.patch(
  "/delete-selected-scorefile",
  ScorefileController.delete_selected_Scorefile
);

route.patch("/:id/restore-scorefile", ScorefileController.restoreOne_Scorefile);
route.patch(
  "/restore-selected-scorefile",
  ScorefileController.restore_selected_Scorefile
);
export default route;
