import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

class Auth {
    async verify(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['access-token'];

        if (!token)
            throw new AppError("Unauthorized: no token provided!");

        try {
            jwt.verify(String(token), process.env.JWT, (error, decoded) => {
                req.headers = Object(decoded);
                if (error)
                    throw new Error();
            });
            next();
        } catch (error) {
            throw new AppError("Token invalid!");
        }
    }
}

export default new Auth();
