import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { RoleRepository } from "../repositories/RoleRepository";

class RoleController {
    async create(req: Request, res: Response) {
        const { name, description, permissions } = req.body;

        const roleRepository = getCustomRepository(RoleRepository);

        const existRole = await roleRepository.findOne({ name });

        if (existRole)
            throw new AppError("Role already exists!");

        const role = roleRepository.create({
            name,
            description,
        });

        await roleRepository.save(role);

        return res.status(200).json({ role, permissions: permissions });
    }
}

export default new RoleController();