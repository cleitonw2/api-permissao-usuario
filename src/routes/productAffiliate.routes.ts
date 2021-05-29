import { Router } from "express";
import { ProductAffiliateController } from "../controllers/ProductAffiliateController";

const router = Router();

const productAffiliateController = new ProductAffiliateController();

router.post(
    "/product_affiliate",
    productAffiliateController.joinAProduct,
);

export default router;