import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { is } from "../middlewares/permission";


const router = Router();

const productController = new ProductController();

const owner = process.env.ROLE_OWNER;
const affiliated = process.env.ROLE_AFFILIATE;

router.post(
    "/products/register",
    is([owner]),
    productController.registerProducts
);

router.get(
    "/product/:user_id/:product_id",
    productController.showProductByID
);

router.post(
    "/products",
    is([owner, affiliated]),
    productController.showProducts
);

router.get(
    "/products/:product_name",
    productController.showProductsByName
);

router.delete(
    "/product/:product_id",
    is([owner]),
    productController.delete
);

router.post(
    "/product/sell_product",
    productController.sellProduct
);


export default router;
