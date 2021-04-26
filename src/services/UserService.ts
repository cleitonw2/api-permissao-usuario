import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { RoleRepository } from "../repositories/RoleRepository";
import { UsersRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Role } from "../models/Role";

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

    private async userExists(email: string) {
        const user = await this.userRepository.findOne({ email });
        return user;
    }

    async create(objt: IUserCreate) {
        const { name, email, password, roles } = objt;

        if (await this.userExists(email))
            throw new AppError("User already exists!");

        const passwordHash = await bcrypt.hash(password, 10);

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
}

export { UserService };