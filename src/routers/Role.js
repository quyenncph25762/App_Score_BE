import express from "express";
import Role from "../controllers/RoleController";
const router = express.Router();

router.get("/roles", Role.getAllRoles);
router.post("/create-role", Role.createRole);
router.put("/:id/role", Role.updateRole);
router.patch("/:id/delete-role", Role.deleteRole);
export default router;
