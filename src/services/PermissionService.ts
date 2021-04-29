import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Permission } from "../models/Permission";
import { PermissionRepository } from "../repositories/PermissionRepository";


class PermissionService {

    private permissionRepository: Repository<Permission>;

    constructor() {
        this.permissionRepository = getCustomRepository(PermissionRepository);
    }

    async createPermission(name: string, description: string) {
        try {
            const existPermission = await this.permissionRepository.findOne({ name });

            if (existPermission)
                throw new AppError("Permission already exists!");

            const permission = this.permissionRepository.create({
                name,
                description,
            });

            await this.permissionRepository.save(permission);

            return permission;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async updatePermission(id: string, name: string, description: string) {
        try {
            await this.permissionRepository.createQueryBuilder()
                .update(Permission)
                .set({ name, description })
                .where("id = :id", {
                    id
                }).execute();

            return;
        } catch (error) {
            throw new AppError(error.message);
        }
    }

    async delete(id: string) {
        try {
            await this.permissionRepository.createQueryBuilder()
                .delete()
                .where("id = :id", {
                    id
                }).execute();

            return;
        } catch (error) {
            throw new AppError(error.message);
        }
    }
}

export { PermissionService };