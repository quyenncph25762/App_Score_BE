const app = express();
import route from "./routers";
import express from "express";
import db from "../src/config/db";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(cookieParser()); // Để xử lý cookies
route(app);
db.connection;

export const viteNodeApp = app;