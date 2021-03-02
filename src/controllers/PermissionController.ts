import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { PermissionRepository } from "../repositories/PermissionRepository";

class PrermissionController {
    async create(req: Request, res: Response) {
        const { name, description } = req.body;

        const permissionRepository = getCustomRepository(PermissionRepository);

        const existPermission = await permissionRepository.findOne({ name });

        if (existPermission)
            throw new AppError("Permission already exists!");

        const permission = permissionRepository.create({
            name,
            description,
        });

        await permissionRepository.save(permission);

        return res.status(200).json(permission);
    }
}

export default new PrermissionController();