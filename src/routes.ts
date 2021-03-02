import { Router } from 'express';
import  Auth  from "./middlewares/auth";
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';
import PrermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";


const router = Router();

const userController = new UserController();
const productController = new ProductController();

router.post("/users", userController.create);
router.post("/login", userController.login);

//Permissions
router.post("/permissions", PrermissionController.create);
//roles
router.post("/roles", RoleController.create);

router.use(Auth.verify);

router.get("/show", userController.show);
router.post("/register", productController.register);
router.get("/products", productController.show);
export { router }