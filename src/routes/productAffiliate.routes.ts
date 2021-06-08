import { Router } from "express";
import { ProductAffiliateController } from "../controllers/ProductAffiliateController";
import { is } from "../middlewares/permission";

const router = Router();

const productAffiliateController = new ProductAffiliateController();

const owner = process.env.ROLE_OWNER;
const affiliated = process.env.ROLE_AFFILIATE;

router.post(
    "/product_affiliate",
    productAffiliateController.joinAProduct,
);

router.post(
    "/affiliates",
    is([owner]),
    productAffiliateController.getProductAffiliates,
);

export default router;