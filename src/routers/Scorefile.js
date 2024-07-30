import express from "express";
import ScorefileController from "../controllers/ScorefileController";
const route = express.Router();

route.post("/create-scorefile", ScorefileController.create_Scorefile);
// lấy scorefile chưa duyệt
route.get(
  "/get-scorefile-inactive",
  ScorefileController.getScorefile_ByEmployeeId_Inactive
);
// lấy scorefile đã duyệt
route.get(
  "/get-scorefile-active-now",
  ScorefileController.getScorefile_ByEmployeeId_ActiveNow
);
// lấy tất cả scorefile
route.get("/get-scorefile", ScorefileController.getScorefile_ByEmployeeId);
// lấy scorefile theo id cấp xã
route.get("/:id/getone-scorefile", ScorefileController.getOne_Scorefile);

//
route.get(
  "/:id/get-one-scorefile-employee-field",
  ScorefileController.getOne_Scorefile_ByEmployeeAndField
);

// update active
route.patch(
  "/:id/update-active-scorefile",
  ScorefileController.update_ActiveScorefile
);

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
