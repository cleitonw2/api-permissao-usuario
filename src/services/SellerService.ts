import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Product } from "../models/Product";
import { Seller } from "../models/Seller";
import { User } from "../models/User";
import { ProductRepository } from "../repositories/ProductRepository";
import { SellerRepository } from "../repositories/SellerRepository";
import { UsersRepository } from "../repositories/UserRepository";


class SellerService {
    private userRepository: Repository<User>;
    private productRepository: Repository<Product>;
    private sellerRepository: Repository<Seller>;

    constructor() {
        this.userRepository = getCustomRepository(UsersRepository);
        this.productRepository = getCustomRepository(ProductRepository);
        this.sellerRepository = getCustomRepository(SellerRepository);
    }

    async getSellerID(id: string) {
        try {

            const user = await this.userRepository.findOne({ id });

            const sellerProducts = await this.sellerRepository.find(
                { where: { user_id: id } },
            );

            const products = [];
            const valueSold = [];

            for (let s of sellerProducts) {
                let product = await this.productRepository.findOne({ id: s.product_id });

                let unity_sold_by_seller = s.unity_sold;

                let total_value_sold = Number(product.price) * Number(s.unity_sold);

                products.push({ product, unity_sold_by_seller, total_value_sold });

                valueSold.push(total_value_sold);
            }

            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            let products_total_value_sold = 0;

            for (let v of valueSold) {
                products_total_value_sold += v
            }

            return { user, products, products_total_value_sold };
        } catch (error) {
            throw new AppError(error.message);
        }
    }
}

export { SellerService };