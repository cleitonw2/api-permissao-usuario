import { Router } from 'express';
import  Auth  from "./middlewares/auth";
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';


const router = Router();

const userController = new UserController();
const productController = new ProductController();

router.post("/users", userController.create);
router.post("/login", userController.login);

router.use(Auth.verify);

router.get("/show", userController.show);
router.post("/register", productController.register);
router.get("/products", productController.show);
export { router }