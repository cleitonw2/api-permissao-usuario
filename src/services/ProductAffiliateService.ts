import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Product } from "../models/Product";
import { ProductAffiliate } from "../models/ProductAffiliate";
import { ProductOwner } from "../models/ProductOwner";
import { User } from "../models/User";
import { ProductAffiliateRepository } from "../repositories/ProductAffiliateRepository";
import { ProductOwnerRepository } from "../repositories/ProductOwnerRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { UsersRepository } from "../repositories/UserRepository";


interface IAffiliateUser {
    product_id: string;
    user_id: string;
}

class ProductAffiliateService {
    private productRepository: Repository<Product>;
    private productAffiliateRepository: Repository<ProductAffiliate>;
    private userRepository: Repository<User>;
    private productOwnerRepository : Repository<ProductOwner>

    constructor() {
        this.productRepository = getCustomRepository(ProductRepository);
        this.productAffiliateRepository = getCustomRepository(ProductAffiliateRepository);
        this.userRepository = getCustomRepository(UsersRepository);
        this.productOwnerRepository = getCustomRepository(ProductOwnerRepository);
    }

    private async isAffiliate(affiliateUser: IAffiliateUser) {
        const { product_id, user_id } = affiliateUser;

        const productAffiliate = await this.productAffiliateRepository.findOne({
            where: { user_id, product_id }
        });

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

    private async isOwner(user_id: string, product_id: string) {
        const isOwner = await this.productOwnerRepository.findOne({
            where: {user_id, product_id}
        });

        if(isOwner) {
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

    async getProductAffiliates(user_id: string, product_id: string) {
        if (!this.isOwner(user_id, product_id)) {
            throw new AppError("User does not owner!");
        }

        const productsID = await this.productAffiliateRepository.find(
            { product_id }
        );

        const usersID = [];

        productsID.filter(p => {
            usersID.push(p.user_id);
        });

        const users = await this.userRepository.findByIds(usersID);

        users.filter(user => {
            user.created_at = undefined;
            user.password = undefined;
            user.updated_at = undefined;
        });

        return users;
    }

}

export { ProductAffiliateService };