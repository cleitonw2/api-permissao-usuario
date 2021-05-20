import { Request, Response } from "express";
import { ForgotPasswordService } from "../services/ForgotPasswordService";


class SendMailController {
    async forgot_password(req: Request, res: Response) {
        const { email } = req.body;

        const { message } = await new ForgotPasswordService().execute(email);

        return res.json({ message });
    }
}

export { SendMailController };