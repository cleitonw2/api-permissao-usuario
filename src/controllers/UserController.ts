import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";
import { RoleRepository } from "../repositories/RoleRepository";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as yup from "yup";

class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password, roles } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            password: yup.string().length(6).required(),
            email: yup.string().email().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error);
        }

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

        return res.status(200).json({ user: user, token: token });
    }

    async show(req: Request, res: Response) {

        const userRepository = getCustomRepository(UsersRepository);

        const users = await userRepository.find({ relations: ["roles"] });

        users.filter(user => {
            user.password = undefined;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
        });

        return res.status(200).json(users);
    }

    async updatedPassword(req: Request, res: Response) {
        const { password, newPassword} = req.body;
        const id = String(req.header);

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
            return res.status(200).json({ message: "Password successfully updated", id: user.id });
        } catch (error) {
            throw new AppError(error);
        }
    }

    async delete(req: Request, res: Response) {
        const id = String(req.header);
        const { password } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne(id);

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            throw new AppError("Invalid password or username!");

        try {
            await userRepository.delete(id);
            return res.status(200).json("User successfully deleted!");
        } catch (error) {
            throw new AppError("It was not possible to delet the user!");
        }
    }

    async reset_password(req: Request, res: Response) {
        const { email, token, password } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne({ email });

        if (!user)
            throw new AppError("User not found!", 401);

        if (token !== user.passwordResetToken)
            throw new AppError("Token invalid!");

        const now = moment().format('YYYY-MM-DD HH:mm');

        if (now > moment(user.passwordResetExpires).format('YYYY-MM-DD HH:mm'))
            throw new AppError("Token expired, generate a new one");

        const passwordHash = await bcrypt.hash(password, 10);

        try {
            await userRepository.update(
                { id: user.id },
                {
                    password: passwordHash,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                }
            );
            return res.status(200).json({ message: "Password successfully updated" });
        } catch (error) {
            throw new AppError(error);
        }
    }
}

export default new UserController();