import { AppError } from "../errors/AppError";
import Queue from "../lib/Queue";
import { resolve } from "path";
import { UserService } from "../services/UserService";
import { UserTokensRepository } from "../repositories/UserTokensRepository";
import { getCustomRepository } from "typeorm";

const userService = () => new UserService();

class ForgotPasswordService {
    async execute(email: string) {
        const userTokensRepository = getCustomRepository(UserTokensRepository);

        const user = await userService().showUserByEmail(email);

        if (!user)
            throw new AppError("User not found!", 401);

        const { token } = await userTokensRepository.generate(user.id);

        const htmlPath = resolve(__dirname, "..", "views", "emails", "passwordToken.hbs");

        const variables = {
            name: user.name,
            title: "Você esqueceu sua senha",
            description: "Não tem problema basta utilizar o token que enviamos",
            token
        }

        try {
            await Queue.add('SendMail', { email, variables, htmlPath });

            return { message: "Email sent successfully!" };
        } catch (error) {
            throw new AppError(error.message);
        }
    }
}

export { ForgotPasswordService };