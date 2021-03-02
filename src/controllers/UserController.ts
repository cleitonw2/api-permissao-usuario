import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await userRepository.findOne({ email });

        if (userAlreadyExists)
            throw new AppError("User already exists!");

        const passwordHash = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            name,
            email,
            password: passwordHash
        });

        await userRepository.save(user);

        return res.status(200).json(user);
    }

    async login(req: Request, res: Response) {

        const { email, password } = req.body;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne({ email });

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            throw new AppError("Password invalid!");

        const token = jwt.sign({ id: user.id }, process.env.JWT, {
            expiresIn: "10d"
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

        res.send(users)
    }

    async updatedPassword(req: Request, res: Response) {
        const { password, newPassword } = req.body;
        const { id } = req.params;

        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findOne(id);

        if (!user)
            throw new AppError("User not found!");

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            throw new AppError("Password invalid!");

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await userRepository.update(user,{
            password: passwordHash
        });
    }
}

export { UserController }