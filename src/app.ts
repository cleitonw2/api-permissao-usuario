import "reflect-metadata";
import express, { NextFunction, Request as Req, Response as Res } from "express";
import "express-async-errors";
import createConnection from "./database";
import { router } from "./routes";
import { AppError } from "./errors/AppError";

import dotenv from "dotenv";
dotenv.config();


createConnection();

const app = express();

app.use(express.json());

app.use(router);

app.use((err: Error, req: Req, res: Res, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    return res.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    });
});

export { app }