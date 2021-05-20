import { Router } from "express";
import userRouter from "./users.routes";
import permissionsRolesRouter from "./permissions.roles.routes";
import productController from "./product.routes";


const router = Router();

router.use(userRouter);
router.use(permissionsRolesRouter);
router.use(productController);

export { router };

