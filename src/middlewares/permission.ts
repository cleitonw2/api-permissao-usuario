import { Request, Response, NextFunction } from "express";
import { decode, verify } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT

async function decoder(req: Request): Promise<User> {
    const token = req.headers['access-token'];

    if (!token)
        throw new AppError("Unauthorized: no token provided!");

    verify(String(token), secret, (error) => {
        if (error)
            throw new AppError(String(error));
    });

    const userRepository = getCustomRepository(UsersRepository);

    const payload = decode(String(token));

    const user = await userRepository.findOne(payload.sub, {
        relations: ["roles"],
    });

    req.header = payload.sub;

    return user;
}

function is(role: String[]) {
    const roleAuthorized = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = await decoder(req);

        const userRoles = user.roles.map((role) => role.name);

        const existsRoles = userRoles.some((r) => role.includes(r));

        if (existsRoles) {
            return next();
        }

        throw new AppError("Not authorized!", 401);
    };

    return roleAuthorized;
}

export { is };