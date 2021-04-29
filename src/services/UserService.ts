import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { RoleRepository } from "../repositories/RoleRepository";
import { UsersRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Role } from "../models/Role";
import jwt from "jsonwebtoken";
import moment from "moment";



interface IUserCreate {
    name: string;
    email: string;
    password: string;
    roles: any;
}

class UserService {

    private userRepository: Repository<User>;
    private roleRepository: Repository<Role>;

    constructor() {
        this.userRepository = getCustomRepository(UsersRepository);
        this.roleRepository = getCustomRepository(RoleRepository);
    }

    private async userExists(email: string, id?: string) {
        if (id === undefined)
            return await this.userRepository.findOne({ email });
        else
            return await this.userRepository.findOne(id);
    }

    private async passwordHashing(password: string) {
        return await bcrypt.hash(password, 10);
    }

    private async isValidPassword(password: string, passwordHashed: string) {
        return await bcrypt.compare(password, passwordHashed);
    }

    async create(objt: IUserCreate) {
        const { name, email, password, roles } = objt;

        if (await this.userExists(email))
            throw new AppError("User already exists!");

        const passwordHash = await this.passwordHashing(password);

        const existsRoles = await this.roleRepository.findByIds(roles);

        if (!existsRoles)
            throw new AppError("Roles not exists!");

        const user = this.userRepository.create({
            name,
            email,
            password: passwordHash,
            roles: existsRoles,
        });

        await this.userRepository.save(user);

        user.passwordResetExpires = undefined;
        user.password = undefined;
        user.passwordResetToken = undefined;

        return user;
    }

    async login(email: string, password: string) {

        const user = await this.userRepository.findOne(
            { email },
            { relations: ["roles"] }
        );

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await this.isValidPassword(password, user.password);

        if (!validPassword)
            throw new AppError("Invalid password or username!");

        const roles = user.roles.map((role) => role.name);

        const token = jwt.sign({ roles }, process.env.JWT, {
            subject: user.id,
            expiresIn: "2d"
        });

        user.password = undefined;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        return { user, token };
    }

    async showUsers() {
        const users = await this.userRepository.find({ relations: ["roles"] });

        users.filter(user => {
            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
        });

        return users;
    }

    async updatePassword(password: string, newPassword: string, id: string) {

        const user = await this.userExists("", id);

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await this.isValidPassword(password, user.password);

        if (!validPassword)
            throw new AppError("Password invalid!");

        const passwordHash = await this.passwordHashing(newPassword);

        try {
            await this.userRepository.update(
                { id: id },
                { password: passwordHash }
            );
            return user.id;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async deleteUser(password: string, id: string) {
        const user = await this.userExists("", id);

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await this.isValidPassword(password, user.password);

        if (!validPassword)
            throw new AppError("Invalid password or username!");

        try {
            await this.userRepository.delete(id);
            return true;
        } catch (error) {
            throw new AppError("It was not possible to delet the user!");
        }
    }

    async resetPassword(email: string, token: string, password: string) {

        const user = await this.userExists(email);

        if (!user)
            throw new AppError("User not found!", 401);

        if (token !== user.passwordResetToken)
            throw new AppError("Token invalid!");

        const now = moment().format('YYYY-MM-DD HH:mm');

        if (now > moment(user.passwordResetExpires).format('YYYY-MM-DD HH:mm'))
            throw new AppError("Token expired, generate a new one");

        const passwordHash = await this.passwordHashing(password);

        try {
            await this.userRepository.update(
                { id: user.id },
                {
                    password: passwordHash,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                }
            );
            return;
        } catch (error) {
            throw new AppError(error.message);
        }
    }
}

export { UserService };