import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { PermissionController } from "../controllers/PermissionController";


const router = Router();

const permissionController = new PermissionController();
const roleController = new RoleController();

router.post("/permissions", permissionController.create);
router.put("/permissions/:permission_id", permissionController.update);
router.delete("/permissions/:permission_id", permissionController.delete);

router.post("/roles", roleController.create);


export default router;
