import { Router } from 'express';
import UserController from './controllers/UserController';
import ProductController from './controllers/ProductController';
import PrermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import SendMailController from "./controllers/SendMailController";
import { is } from "./middlewares/permission";


const router = Router();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN"

router.post("/users", UserController.create);
router.post("/login", UserController.login);
router.patch("/forgot_password", SendMailController.forgot_password);
router.post("/reset_password", UserController.reset_password);

//register permissions
router.post("/permissions", PrermissionController.create);
router.post("/roles", RoleController.create);

router.patch("/update_password", is([user, admin]), UserController.updatedPassword);

router.get("/show", is([admin]), UserController.show);
router.post("/register", is([admin]), ProductController.register);
router.get("/products", is([user, admin]), ProductController.show);
router.get("/products/:name", is([user, admin]), ProductController.get);

router.delete("/product/:id", is([admin]), ProductController.delete);
router.delete("/user/:id", is([admin, user]), UserController.delete);

export { router }