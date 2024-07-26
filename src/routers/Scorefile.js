import express from "express";
import ScorefileController from "../controllers/ScorefileController";
const route = express.Router();

route.post("/create-scorefile", ScorefileController.create_Scorefile);
route.get(
  "/get-scorefile-inactive",
  ScorefileController.getScorefile_ByEmployeeId_Inactive
);
route.get(
  "/get-scorefile-active-now",
  ScorefileController.getScorefile_ByEmployeeId_ActiveNow
);
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
