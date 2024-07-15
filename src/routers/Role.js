import express from "express";
import Role from "../controllers/RoleController";
const router = express.Router();
//get all
router.get("/roles", Role.getAllRoles);
//get one
router.get("/:id/one-role", Role.getOneRole);
//trash
router.get("/trash-roles", Role.getAllTrashRoles);
//create
router.post("/create-role", Role.createRole);
//update
router.patch("/:id/role", Role.updateRole);
//delete
router.patch("/:id/delete-role", Role.deleteRole);
//restore
router.patch("/:id/restore", Role.restoreRoles);
export default router;
