import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { ProductRepository } from "../repositories/ProductRepository";
import { UsersRepository } from "../repositories/UserRepository";


class ProductController {
    async register(req: Request, res: Response) {
        const { products } = req.body;
        const { id } = Object(req.headers)

        const productRepository = getCustomRepository(ProductRepository);

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne(id);


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
        res.status(200).json({ message: "Successfully registered products" })
    }

    async show(req: Request, res: Response) {
        const { product_name } = req.query;

        const productRepository = getCustomRepository(ProductRepository);
        if (!product_name) {
            const products = await productRepository.find();
            res.status(200).json(products);
        }
        const products = await productRepository.findOne({
            product_name: String(product_name)
        });
        res.status(200).json(products);
    }
}

export { ProductController }