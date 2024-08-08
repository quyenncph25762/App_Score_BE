import express from "express";
import ScorefileController from "../controllers/ScorefileController";
import checkout from "../middlewares/checkout";
const route = express.Router();
// tạo scorefile cho xã
route.post("/create-scorefile", ScorefileController.create_Scorefile);
// tạo scorefilel cho huyện
route.get(
  "/:id/create-scorefile-for-district",
  ScorefileController.create_scorefile_forAdminDistrict
);

// lấy tất cả scorefile
route.get(
  "/get-scorefile",

  ScorefileController.getScorefile_ByEmployeeId
);
// lấy score file theo employee và field
route.get(
  "/:id/get-one-scorefile-employee-field",
  ScorefileController.getOne_Scorefile_ByEmployeeAndField
);
//lấy scorefile theo id
// update active
route.patch(
  "/:id/update-active-scorefile",
  ScorefileController.update_ActiveScorefile
);
// chấm điểm
route.patch("/update-scorefile", ScorefileController.update_Scorefile);

route.patch("/:id/delete-scorefile", ScorefileController.deleteOne_Scorefile);
route.patch(
  "/:id/delete-selected-scorefile",
  ScorefileController.delete_selected_Scorefile
);

route.patch("/:id/restore-scorefile", ScorefileController.restoreOne_Scorefile);
route.patch(
  "/:id/restore-selected-scorefile",
  ScorefileController.restore_selected_Scorefile
);
export default route;
