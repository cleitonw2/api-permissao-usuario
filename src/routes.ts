import { Router } from 'express';
import UserController from './controllers/UserController';
import ProductController from './controllers/ProductController';
import PrermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import SendMailController from "./controllers/SendMailController";
import { is } from "./middlewares/permission";


const router = Router();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN";

//user
router.post("/users", UserController.create);
router.post("/login", UserController.login);
router.post("/reset_password", UserController.reset_password);
router.patch("/update_password", is([user, admin]), UserController.updatedPassword);
router.get("/show", is([admin]), UserController.show);
router.delete("/user/:id", is([admin, user]), UserController.delete);

//email
router.patch("/forgot_password", SendMailController.forgot_password);

//permission
router.post("/permissions", PrermissionController.create);

//role
router.post("/roles", RoleController.create);

//product
router.post("/register", is([admin]), ProductController.register);
router.get("/products", is([user, admin]), ProductController.show);
router.get("/products/:name", is([user, admin]), ProductController.get);
router.delete("/product/:id", is([admin]), ProductController.delete);
router.post("/sell_product", is([user, admin]), ProductController.sellProduct);

export { router }