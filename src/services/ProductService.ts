import { getCustomRepository, getRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Product } from "../models/Product";
import { ProductAffiliate } from "../models/ProductAffiliate";
import { ProductOwner } from "../models/ProductOwner";
import { Seller } from "../models/Seller";
import { ProductAffiliateRepository } from "../repositories/ProductAffiliateRepository";
import { ProductOwnerRepository } from "../repositories/ProductOwnerRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { SellerRepository } from "../repositories/SellerRepository";


class ProductService {

    private productRepository: Repository<Product>;
    private sellerRepository: Repository<Seller>;
    private productOwnerRepository: Repository<ProductOwner>;
    private productAffiliateRepository: Repository<ProductAffiliate>;

    constructor() {
        this.productRepository = getCustomRepository(ProductRepository);
        this.sellerRepository = getCustomRepository(SellerRepository);
        this.productOwnerRepository = getCustomRepository(ProductOwnerRepository);
        this.productAffiliateRepository = getCustomRepository(ProductAffiliateRepository);
    }


    private async isOwner(user_id: string, product_id: string) {
        const productIDS = await this.getProductOwnerID(user_id);

        const products = await this.productRepository.findByIds(productIDS);

        for (let product of products) {
            if (product.id === product_id)
                return true;
        }
        return false;
    }

    private async getProductAffiliateID(user_id: string) {
        const productOwner = await this.productAffiliateRepository.find({ user_id });
        const products = productOwner.map(p => p.product_id);

        return products;
    }

    private async getProductOwnerID(user_id: string) {
        const productOwner = await this.productOwnerRepository.find({ user_id });
        const products = productOwner.map(p => p.product_id);

        return products;
    }

    async registerProducts(products: Product, owner: string) {
        const product = this.productRepository.create({
            product_name: products.product_name,
            price: products.price,
            bar_code: products.bar_code,
            quantity_sold: products.quantity_sold,
            quantity_stock: products.quantity_stock,
            commission_by_sales: products.commission_by_sales,
            allowed_membership: products.allowed_membership,
        });

        await this.productRepository.save(product);

        const productOwner = this.productOwnerRepository.create({
            user_id: owner,
            product_id: product.id,
        })
        await this.productOwnerRepository.save(productOwner);
        return;
    }

    async showProductByID(product_id: string) {
        return await this.productRepository.findOne({ id: product_id });
    }

    async showProducts(user_id: string, role: string): Promise<Product[]> {
        if (role === process.env.ROLE_OWNER) {
            const productIDS = await this.getProductOwnerID(user_id);
            const products = await this.productRepository.findByIds(productIDS);
            return products;
        }

        if (role === process.env.ROLE_AFFILIATE) {
            const productIDS = await this.getProductAffiliateID(user_id);
            const products = await this.productRepository.findByIds(productIDS);
            return products;
        }
    }

    async showProductsName(name: string): Promise<Product[]> {
        try {
            const products = await getRepository(Product)
                .createQueryBuilder("products")
                .where("products.product_name like :product_name", { product_name: `%${name}%` })
                .getMany();

            return products;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async deleteProduct(productID: string, userID: string) {
        const is = await this.isOwner(userID, productID);

        if (!is)
            throw new AppError("Error when deleting product!");

        await this.productRepository.delete(
            { id: productID }
        );
        return;
    }

    async sellProduct(product_id: string, user_id: string, unity_sold: number) {
        try {
            const product = await this.productRepository.findOne({ id: product_id });

            const emptyStock = 0;

            if (product.quantity_stock === emptyStock || unity_sold > product.quantity_stock)
                throw new AppError("No product in stock!");

            let stock = Number(product.quantity_stock) - unity_sold;
            let sold = Number(product.quantity_sold) + unity_sold;

            await this.productRepository.update(
                { id: product_id },
                {
                    quantity_stock: stock,
                    quantity_sold: sold,
                }
            );

            const productSold = await this.sellerRepository.findOne({ where: { user_id, product_id } });

            if (productSold) {
                const unity = Number(productSold.unity_sold) + unity_sold;

                await this.sellerRepository.update(
                    { id: productSold.id },
                    {
                        unity_sold: unity
                    });

            } else {
                const seller = this.sellerRepository.create({
                    user_id,
                    product_id,
                    unity_sold,
                });

                await this.sellerRepository.save(seller);
            }

            return;
        } catch (error) {
            throw new AppError(error.message);
        }
    }
}

export { ProductService };