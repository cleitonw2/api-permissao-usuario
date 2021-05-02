import { Router } from 'express';
import UserController from './controllers/UserController';
import ProductController from './controllers/ProductController';
import PrermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import SendMailController from "./controllers/SendMailController";
import SellerController from "./controllers/SellerController";
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
router.get("/show/id", is([admin, user]), UserController.showUserByID);
router.delete("/user", is([admin, user]), UserController.delete);

//email
router.patch("/forgot_password", SendMailController.forgot_password);

//permission
router.post("/permissions", PrermissionController.create);
router.put("/permissions/:permission_id", PrermissionController.update);
router.delete("/permissions/:permission_id", PrermissionController.delete);

//role
router.post("/roles", RoleController.create);

//product
router.post("/products/register", is([admin]), ProductController.registerProducts);
router.get("/product/:product_id", is([user, admin]), ProductController.showProductByID);
router.get("/products", is([user, admin]), ProductController.showProducts);
router.get("/products/:product_name", is([user, admin]), ProductController.showProductsByName);
router.delete("/product/:id", is([admin]), ProductController.delete);
router.post("/product/sell_product", is([user, admin]), ProductController.sellProduct);

//seller
router.get("/:user_id", is([admin]), SellerController.getSellerID);
//generate report of all sellers
router.get("/generate/report", is([admin]), SellerController.generateSellersReport);
//generate report from a seller 
router.get("/generate/report/:user_id", is([admin, user]), SellerController.generateSellerReport);
router.get("/pdf/seller/:pdfPath", is([admin, user]), SellerController.getSellerPDF);

export { router }