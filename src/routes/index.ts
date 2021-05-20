import { Router } from "express";
import userRouter from "./users.routes";
import permissionsRolesRouter from "./permissions.roles.routes";


const router = Router();

router.use(userRouter);
router.use(permissionsRolesRouter);

export { router };

