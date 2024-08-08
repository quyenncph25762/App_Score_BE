import express from "express";
import Employee from "../controllers/EmployeeController";
const router = express.Router();

router.get("/getAllEmployee", Employee.getAll);

router.get("/trash-employee", Employee.trashEmployee);

router.get("/:id/get-all-field-employee", Employee.getAll_FieldEmployee);

//lấy các employee để phát phiếu chấm
router.get(
  "/get-employee-to-create-scorefile",
  Employee.getEmployeeToCreateScorefile
);

router.post("/create-employee", Employee.createEmployee);

router.patch("/:id/update-employee", Employee.updateEmployee);

//get one
router.get("/:id/getOne-Employee", Employee.getOneById);

//restore one
router.patch("/restore-employee", Employee.restoreOneEmployee);
//restore selected
router.patch(
  "/restore-all-selected-employee",
  Employee.restoreAllSelected_Employee
);

//delete one
router.patch("/delete-employee", Employee.deleteOneEmployee);
//delete selected
router.patch(
  "/delete-all-selected-employee",
  Employee.deleteAllSelected_Employee
);
//login
router.post("/login", Employee.login);
export default router;
