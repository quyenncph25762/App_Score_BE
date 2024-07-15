import express from "express";
import Home from "../controllers/HomeController";
const router = express.Router();
// lấy địa chỉ
router.get("/cities", Home.getAllCities);
router.get("/:id/district", Home.getAllDistricts);
router.get("/:id/ward", Home.getAllWards);

// get object  field
router.get("/objects", Home.getAllObjects);
router.get("/fields", Home.getAllFields);

router.get("/apartments", Home.getAllApartment);

export default router;
