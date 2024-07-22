import express from "express";
import ScorefileController from "../controllers/ScorefileController";
const route = express.Router();

route.post("/create-scorefile", ScorefileController.create_Scorefile);
route.get("/get-scorefile", ScorefileController.getScorefile_ByEmployeeId);
export default route;
