import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { RoleRepository } from "../repositories/RoleRepository";

class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password, roles } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const roleRepository = getCustomRepository(RoleRepository);

        const userAlreadyExists = await userRepository.findOne({ email });

        if (userAlreadyExists)
            throw new AppError("User already exists!");

        const passwordHash = await bcrypt.hash(password, 10);

        const existsRoles = await roleRepository.findByIds(roles);

        if (!existsRoles)
            throw new AppError("Roles not exists!");

        const user = userRepository.create({
            name,
            email,
            password: passwordHash,
            roles: existsRoles,
        });

        await userRepository.save(user);

        user.passwordResetExpires = undefined;
        user.password = undefined;
        user.passwordResetToken = undefined;

        return res.status(200).json(user);
    }

    async login(req: Request, res: Response) {

        const { email, password } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne(
            { email },
            { relations: ["roles"] }
        );

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await bcrypt.compare(password, user.password);

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

        res.status(200).json({ user: user, token: token });
    }

    async show(req: Request, res: Response) {

        const userRepository = getCustomRepository(UsersRepository);

        const users = await userRepository.find();

        users.filter(user => {
            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
        })

        res.status(200).json(users)
    }

    async updatedPassword(req: Request, res: Response) {
        const { password, newPassword, id } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne(id);

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            throw new AppError("Password invalid!");

        const passwordHash = await bcrypt.hash(newPassword, 10);

        try {
            await userRepository.update(
                { id: id },
                { password: passwordHash }
            );
            res.status(200).json({ message: "Password successfully updated", id: user.id });
        } catch (error) {
            throw new AppError(error);
        }
    }
}

export default new UserController();