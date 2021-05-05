import { getCustomRepository, getRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Product } from "../models/Product";
import { Seller } from "../models/Seller";
import { ProductRepository } from "../repositories/ProductRepository";
import { SellerRepository } from "../repositories/SellerRepository";


class ProductService {

    private productRepository: Repository<Product>;
    private sellerRepository: Repository<Seller>;

    constructor() {
        this.productRepository = getCustomRepository(ProductRepository);
        this.sellerRepository = getCustomRepository(SellerRepository);
    }

    async registerProducts(products: any) {
        try {
            products.filter(async (p: {
                product_name: string;
                price: Number;
                bar_code: string;
                sold: Number;
                stock: Number;
                commission_by_sales: Number;
            }) => {
                const product = this.productRepository.create({
                    product_name: p.product_name,
                    price: p.price,
                    bar_code: p.bar_code,
                    quantity_sold: p.sold,
                    quantity_stock: p.stock,
                    commission_by_sales: p.commission_by_sales,
                });
                await this.productRepository.save(product);
            });
            return;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async showProductByID(product_id: string) {
        try {
            return await this.productRepository.findOne({ id: product_id });
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async showProducts() {
        try {
            const products = await this.productRepository.find();
            return products;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async showProductsName(name: string) {
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

    async deleteProduct(productID: string) {
        try {
            await this.productRepository.delete(
                { id: productID }
            );
            return;
        } catch (error) {
            throw new AppError("Error when deleting product!");
        }
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