import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { ProductRepository } from "../repositories/ProductRepository";


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
        res.status(200).json({ message: "Successfully registered products" });
    }

    async show(req: Request, res: Response) {

        const productRepository = getCustomRepository(ProductRepository);

        const products = await productRepository.find();

        res.status(200).json(products);
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

            res.status(200).json(products);
        } catch (error) {
            throw new AppError(error)
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const productRepository = getCustomRepository(ProductRepository);

        try {
            await productRepository.delete(
                { id }
            );
            res.status(200).json("Product deleting successfully")
        } catch (error) {
            throw new AppError("Error when deleting product!");
        }
    }
}

export default new ProductController();