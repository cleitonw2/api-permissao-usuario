import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

const productService = () => new ProductService();

class ProductController {
    async registerProducts(req: Request, res: Response) {
        const id = req.header;
        const products = req.body;
        const owner = String(id);

        await productService().registerProducts(products, owner);

        return res.status(200).json({ message: "Successfully registered products" });
    }

    async showProducts(req: Request, res: Response) {
        const id = req.header;
        const owner_id = String(id);
        const { role } = req.body;

        const productsINStock = await productService().showProducts(owner_id, role);

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
        const { product_id } = req.params;
        const id = req.header;
        const user_id = String(id);

        await productService().deleteProduct(product_id, user_id);

        return res.status(200).json("Product deleting successfully");
    }

    async sellProduct(req: Request, res: Response) {
        const { unity_sold, product_id } = req.body;
        const id = req.header;
        const user_id = String(id);

        await productService().sellProduct(product_id, user_id, unity_sold);

        return res.status(200).json("ok");
    }
}

export { ProductController };