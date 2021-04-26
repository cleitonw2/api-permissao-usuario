import { Request, Response } from "express";
import { SellerService } from "../services/SellerService";

const sellerService = () => new SellerService();

class SellerController {

    async getSellerID(req: Request, res: Response) {
        const { user_id } = req.params;

        const { user, products } = await sellerService().getSellerID(user_id);

        return res.status(200).json({
            user,
            products
        });
    }
}

export default new SellerController();