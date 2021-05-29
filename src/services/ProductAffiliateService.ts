import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Product } from "../models/Product";
import { ProductAffiliate } from "../models/ProductAffiliate";
import { ProductAffiliateRepository } from "../repositories/ProductAffiliateRepository";
import { ProductRepository } from "../repositories/ProductRepository";


interface IAffiliateUser {
    product_id: string;
    user_id: string;
}

class ProductAffiliateService {
    private productRepository: Repository<Product>;
    private productAffiliateRepository: Repository<ProductAffiliate>;

    constructor() {
        this.productRepository = getCustomRepository(ProductRepository);
        this.productAffiliateRepository = getCustomRepository(ProductAffiliateRepository);
    }

    private async isAffiliate(affiliateUser: IAffiliateUser) {
        const { product_id, user_id } = affiliateUser;

        const productAffiliate = await this.productAffiliateRepository.findOne({
            where: { user_id, product_id }
        })

        if (productAffiliate) {
            return true;
        }

        return false;
    }

    private async acceptsMembers(product_id: string) {
        const product = await this.productRepository.findOne({ id: product_id });

        if (product.allowed_membership) {
            return true;
        }

        return false;
    }

    async create(affiliateUser: IAffiliateUser) {
        const { product_id, user_id } = affiliateUser;

        if (await this.isAffiliate(affiliateUser)) {
            throw new AppError("User is affiliated");
        }

        if (!await this.acceptsMembers(product_id)) {
            throw new AppError("Not accepts members");
        }

        const webUrl = process.env.URL;
        const url = `${webUrl}/${user_id}/${product_id}`;

        const productAffiliate = this.productAffiliateRepository.create({
            user_id,
            product_id,
            url
        });

        await this.productAffiliateRepository.save(productAffiliate);
        return productAffiliate;
    }

}

export { ProductAffiliateService };