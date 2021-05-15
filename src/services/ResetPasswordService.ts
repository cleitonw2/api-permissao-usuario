import moment from "moment";
import { getCustomRepository } from "typeorm";
import { UserTokensRepository } from "../repositories/UserTokensRepository";
import { UsersRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";
import bcrypt from "bcrypt";


class ResetPasswordService {
    async execute(email: string, token: string, password: string) {
        const userTokensRepository = getCustomRepository(UserTokensRepository);
        const userRepository = getCustomRepository(UsersRepository);

        const userToken = await userTokensRepository.findByToken(token);

        const user = await userRepository.findOne({ id: userToken.user_id });

        if (!user)
            throw new AppError("User not found!")

        const compareDate = moment(userToken.created_at).add(2, "hours");
        let now = moment().format();

        if (!moment(now).isBefore(compareDate))
            throw new AppError("Token expired, generate a new one");

        const passwordHash = await bcrypt.hash(password, 10);

        try {
            await userRepository.update(
                { id: user.id },
                {
                    password: passwordHash,
                }
            );
            return;
        } catch (error) {
            throw new AppError(error.message);
        }

    }
}

export { ResetPasswordService };