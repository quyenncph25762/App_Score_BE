import express from "express";
import Employee from "../controllers/EmployeeController";
const router = express.Router();

router.get("/getAllEmployee", Employee.getAll);

router.get("/getAll-info-Employee", Employee.getAll_InfoEmployee);

router.post("/create-employee", Employee.createEmployee);

router.patch("/:id/update-employee", Employee.updateEmployee);

//get one
router.get("/getOne-Employee",Employee.getOneById)
//delete one
router.patch("/delete-employee", Employee.deleteOneEmployee);
//delete selected
router.patch("/delete-all-selected-employee", Employee.deleteAllSelected_Employee);
//login
router.post("/login", Employee.login);
export default router;
