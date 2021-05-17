import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

const productService = () => new ProductService();

class ProductController {
    async registerProducts(req: Request, res: Response) {
        const products = req.body;

        await productService().registerProducts(products);

        return res.status(200).json({ message: "Successfully registered products" });
    }

    async showProducts(req: Request, res: Response) {

        const productsINStock = await productService().showProducts();

        return res.status(200).json(productsINStock);
    }

    async showProductsByName(req: Request, res: Response) {
        const { product_name } = req.params;

        const products = await productService().showProductsName(product_name);

        return res.status(200).json(products);
    }

    async showProductByID(req: Request, res: Response) {
        const { product_id } = req.params;

        const product = await productService().showProductByID(product_id);

        res.status(200).json(product);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        await productService().deleteProduct(id);

        return res.status(200).json("Product deleting successfully")
    }

    async sellProduct(req: Request, res: Response) {
        const { unity_sold, product_id } = req.body;
        const id = req.header;
        const user_id = String(id);

        await productService().sellProduct(product_id, user_id, unity_sold);

        return res.status(200).json("ok");
    }
}

export default new ProductController();