import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { ProductRepository } from "../repositories/ProductRepository";
import { SellerRepository } from "../repositories/SellerRepository";
import { UsersRepository } from "../repositories/UserRepository";

class SellerController {

    async getSeller(req: Request, res: Response) {
        const { user_id } = req.params;

        const sellerRepository = getCustomRepository(SellerRepository);
        const productRepository = getCustomRepository(ProductRepository);
        const userRepository = getCustomRepository(UsersRepository);

        try {

            const user = await userRepository.findOne({ id: user_id });

            const sellerProducts = await sellerRepository.find(
                { where: { user_id } },
            );

            const products = [];
            const valueSold = []; 
            for (let s of sellerProducts) {
                let product = await productRepository.findOne({ id: s.product_id });
                let unity_sold_by_seller = s.unity_sold;
                let total_value_sold = Number(product.price) * Number(s.unity_sold);
                products.push({ product, unity_sold_by_seller, total_value_sold });
                valueSold.push(total_value_sold);
            }

            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            let totalValueSold = 0;
            for (let v of valueSold) {
                totalValueSold += v
            }

            products.push({ products_total_value_sold: totalValueSold});

            res.status(200).json({
                user,
                products
            });
        } catch (error) {
            throw new AppError(error);
        }
    }
}

export default new SellerController();