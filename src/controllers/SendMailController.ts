import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";
import crypto from "crypto";
import moment from "moment";

class SendMailController {
    async forgot_password(req: Request, res: Response) {
        const { email } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne({ email });

        if (!user)
            throw new AppError("User not found!", 401);

        const token = crypto.randomBytes(3).toString('hex');

        const now = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm');

        const npsPath = resolve(__dirname, "..", "views", "emails", "passwordToken.hbs");

        const variables = {
            name: user.name,
            title: "Você esqueceu sua senha",
            description: "Não tem problema basta utilizar o token que enviamos",
            token
        }

        try {
            await userRepository.update(
                { id: user.id },
                {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            );

            await SendMailService.execute(email, variables.title, variables, npsPath);

            res.status(200).json({ message: "Email sent successfully!" });
        } catch (error) {
            throw new AppError(error);
        }
    }
}

export default new SendMailController();