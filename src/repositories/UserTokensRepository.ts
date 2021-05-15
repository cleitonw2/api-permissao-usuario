import { EntityRepository, Repository } from "typeorm";
import { UserToken } from "../models/UserToken";

@EntityRepository(UserToken)
class UserTokensRepository extends Repository<UserToken> {
    async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.findOne({
            where: {
                token,
            }
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        try {
            const userToken = this.create({ user_id });

            await this.save(userToken);

            return userToken;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    public async removeToken(token_id: string) {
        await this.delete({ id: token_id });
        return;
    }
}

export { UserTokensRepository };