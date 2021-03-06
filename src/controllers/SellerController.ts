import { Request, Response } from "express";
import { resolve } from "path";
import Queue from "../lib/Queue";
import { SellerService } from "../services/SellerService";
import handlebars from "handlebars";
import fs from "fs";

const sellerService = () => new SellerService();

class SellerController {

    async getSellerID(req: Request, res: Response) {
        const { user_id } = req.params;

        const { user, products, products_total_value_sold, sellers_commission } = await sellerService().getSellerID(user_id);

        user.password = undefined;

        return res.status(200).json({
            user,
            products,
            products_total_value_sold,
            sellers_commission,
        });
    }

    async generateSellerReport(req: Request, res: Response) {
        const { user_id } = req.params;

        const variables = await sellerService().getSellerID(user_id);

        const downloadPath = resolve(__dirname, "..", "downloads", `${variables.user.email}.pdf`);

        const pdfTemplate = resolve(__dirname, "..", "views", "pdfTemplate", "sellerReport.hbs");

        const templateFileContent = fs.readFileSync(pdfTemplate).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables);

        await Queue.add('GeneratePdf', { html, downloadPath });

        return res.status(201).json("pdf successfully generated!")
    }

    async generateSellersReport(req: Request, res: Response) {
        const { email } = req.body;

        const variables = await sellerService().getSellersProducts();

        const downloadPath = resolve(__dirname, "..", "downloads", `${email}.pdf`);

        const pdfTemplate = resolve(__dirname, "..", "views", "pdfTemplate", "fullSellersReport.hbs");

        const templateFileContent = fs.readFileSync(pdfTemplate).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables);

        await Queue.add('GeneratePdf', { html, downloadPath });

        return res.status(201).json("pdf successfully generated!")
    }

    async getSellerPDF(req: Request, res: Response) {
        const { email } = req.body;

        const pdf = resolve(__dirname, "..", "downloads", `${email}.pdf`);
        res.sendFile(pdf);
    }
}

export { SellerController };