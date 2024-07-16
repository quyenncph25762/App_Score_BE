import express from "express";
import Employee from "../controllers/EmployeeController";
const router = express.Router();

router.get("/getAllEmployee", Employee.getAll);

router.get("/getAll-info-Employee", Employee.getAll_InfoEmployee);

router.post("/create-employee", Employee.createEmployee);

router.patch("/:id/update-employee", Employee.updateEmployee);
//login
router.post("/login", Employee.login);
export default router;
