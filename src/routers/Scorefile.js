import express from "express";
import ScorefileController from "../controllers/ScorefileController";
const route = express.Router();

route.post("/create-scorefile", ScorefileController.create_Scorefile);
export default route;
