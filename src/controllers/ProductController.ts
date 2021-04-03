import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { ProductRepository } from "../repositories/ProductRepository";
import { SellerRepository } from "../repositories/SellerRepository";


class ProductController {
    async register(req: Request, res: Response) {
        const { products } = req.body;

        const productRepository = getCustomRepository(ProductRepository);

        products.filter(async (p: {
            product_name: string;
            price: Number;
            bar_code: string;
            sold: Number;
            stock: Number;
        }) => {
            const product = productRepository.create({
                product_name: p.product_name,
                price: p.price,
                bar_code: p.bar_code,
                quantity_sold: p.sold,
                quantity_stock: p.stock
            });
            await productRepository.save(product);
        });
        return res.status(200).json({ message: "Successfully registered products" });
    }

    async show(req: Request, res: Response) {

        const productRepository = getCustomRepository(ProductRepository);

        const products = await productRepository.find();

        return res.status(200).json(products);
    }

    async get(req: Request, res: Response) {
        const { name } = req.params;
        try {
            const productRepository = getCustomRepository(ProductRepository);

            const products = await productRepository.find({
                where: [{
                    product_name: name
                }]
            });

            return res.status(200).json(products);
        } catch (error) {
            throw new AppError(error);
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const productRepository = getCustomRepository(ProductRepository);

        try {
            await productRepository.delete(
                { id }
            );
            return res.status(200).json("Product deleting successfully")
        } catch (error) {
            throw new AppError("Error when deleting product!");
        }
    }

    async sellProduct(req: Request, res: Response) {
        const { unity_sold, product_id } = req.body;
        const id = req.header;
        const user_id = String(id);

        const productRepository = getCustomRepository(ProductRepository);
        const sellerRepository = getCustomRepository(SellerRepository);

        try {
            const product = await productRepository.findOne({ id: product_id });

            const emptyStock = 0;

            if (product.quantity_stock === emptyStock || unity_sold > product.quantity_stock)
                throw new AppError("No product in stock!");

            let stock = Number(product.quantity_stock) - unity_sold;
            let sold = Number(product.quantity_sold) + unity_sold;

            await productRepository.update(
                { id: product_id },
                {
                    quantity_stock: stock,
                    quantity_sold: sold,
                }
            );

            const productSold = await sellerRepository.findOne({ where: { user_id, product_id } });

            if (productSold) {
                const unity = productSold.unity_sold + unity_sold;

                await sellerRepository.update(
                    { id: productSold.id },
                    {
                        unity_sold: unity
                    });

            } else {
                const seller = sellerRepository.create({
                    user_id,
                    product_id,
                    unity_sold,
                });

                await sellerRepository.save(seller);
            }

            return res.status(200).json("ok");
        } catch (error) {
            throw new AppError(error);
        }
    }
}

export default new ProductController();