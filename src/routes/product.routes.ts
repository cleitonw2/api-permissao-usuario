import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { is } from "../middlewares/permission";


const router = Router();

const productController = new ProductController();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN";

router.post(
    "/products/register",
    is([admin]),
    productController.registerProducts
);

router.get(
    "/product/:product_id",
    is([user, admin]),
    productController.showProductByID
);

router.get(
    "/products",
    is([user, admin]),
    productController.showProducts
);

router.get(
    "/products/:product_name",
    is([user, admin]),
    productController.showProductsByName
);

router.delete(
    "/product/:id",
    is([admin]),
    productController.delete
);

router.post(
    "/product/sell_product",
    is([user, admin]),
    productController.sellProduct
);


export default router;
