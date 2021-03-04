import { Router } from 'express';
import UserController from './controllers/UserController';
import ProductController from './controllers/ProductController';
import PrermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import { is } from "./middlewares/permission";


const router = Router();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN"

//public routes
router.post("/users", UserController.create);
router.post("/login", UserController.login);

//register permissions
router.post("/permissions", PrermissionController.create);
router.post("/roles", RoleController.create);

router.put("/update_password", is([user, admin]), UserController.updatedPassword);


router.get("/show", is([admin]), UserController.show);
router.post("/register", is([admin]), ProductController.register);
router.get("/products", is([user, admin]), ProductController.show);

export { router }