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
//delete one
router.patch("/:id/delete-role", Role.deleteRole);
//restore one
router.patch("/:id/restore", Role.restoreRole);
//delete all select
router.patch("/delete-selected-roles", Role.deleteAllSelectedRoles);
//restore all selected
router.patch("/restore-selected-roles", Role.restoreAllSelectedRoles);
export default router;
