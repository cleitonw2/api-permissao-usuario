import { Router } from 'express';
import ProductController from './controllers/ProductController';
import SendMailController from "./controllers/SendMailController";
import SellerController from "./controllers/SellerController";
import { is } from "./middlewares/permission";


const router = Router();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN";

//email
router.patch("/forgot_password", SendMailController.forgot_password);

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
router.post("/generate/report", is([admin]), SellerController.generateSellersReport);
//generate report from a seller 
router.get("/generate/report/:user_id", is([admin, user]), SellerController.generateSellerReport);
router.post("/pdf/seller", is([admin, user]), SellerController.getSellerPDF);

export { router }