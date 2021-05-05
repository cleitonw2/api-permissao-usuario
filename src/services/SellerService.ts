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
            const sellersCommission = []

            for (let s of sellerProducts) {
                let product = await this.productRepository.findOne({ id: s.product_id });

                let unity_sold_by_seller = s.unity_sold;

                let total_value_sold = Number(product.price) * Number(s.unity_sold);

                let commission = Number(product.commission_by_sales) * total_value_sold / 100

                products.push({ product, unity_sold_by_seller, total_value_sold });

                valueSold.push(total_value_sold);

                sellersCommission.push(commission);
            }

            let products_total_value_sold = 0;
            let sellers_commission = 0; // seller's commission

            for (let value of valueSold) {
                products_total_value_sold += value;
            }

            for (let commission of sellersCommission) {
                sellers_commission += commission;
            }

            return { user, products, products_total_value_sold, sellers_commission };
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async getSellersProducts() {
        const users = await this.userRepository.find();
        const obj = [];

        let totalSalesAmount = 0;
        let valueOfCommissions = 0;

        for (let user of users) {
            let sellerProducts = await this.getSellerID(user.id);
            obj.push(sellerProducts);
        }

        for (let userProducts of obj) {
            totalSalesAmount += userProducts.products_total_value_sold;
            valueOfCommissions += userProducts.sellers_commission;
        }

        obj.push({ 
            total_sales_amount: totalSalesAmount,
            total_value_of_commissions: valueOfCommissions,
         });
        return obj;
    }
}

export { SellerService };