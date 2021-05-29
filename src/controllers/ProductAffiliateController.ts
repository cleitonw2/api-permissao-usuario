import { Request, Response } from "express";
import { ProductAffiliateService } from "../services/ProductAffiliateService";

const productAffiliateService = () => new ProductAffiliateService();

class ProductAffiliateController {
    async joinAProduct(req: Request, res: Response) {
        const { product_id, user_id } = req.body;

        const productAffiliate = await productAffiliateService()
            .create({ product_id, user_id });

        return res.status(201).json(productAffiliate);
    }
}

export { ProductAffiliateController };