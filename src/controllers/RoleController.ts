import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { PermissionRepository } from "../repositories/PermissionRepository";
import { RoleRepository } from "../repositories/RoleRepository";

class RoleController {
    async create(req: Request, res: Response) {
        const { name, description, permissions } = req.body;

        const roleRepository = getCustomRepository(RoleRepository);

        const permissionRepository = getCustomRepository(PermissionRepository);

        const existRole = await roleRepository.findOne({ name });

        if (existRole)
            throw new AppError("Role already exists!");

        const existsPermissions = await permissionRepository.findByIds(permissions);

        if(!existsPermissions)
            throw new AppError("Permission not exists!");

        const role = roleRepository.create({
            name,
            description,
            permission: existsPermissions
        });

        await roleRepository.save(role);

        return res.status(200).json(role);
    }
}

export default new RoleController();