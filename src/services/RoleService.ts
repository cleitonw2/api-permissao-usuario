import { getCustomRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Permission } from "../models/Permission";
import { Role } from "../models/Role";
import { PermissionRepository } from "../repositories/PermissionRepository";
import { RoleRepository } from "../repositories/RoleRepository";


interface IRoleCreate {
    name: string;
    description: string;
    permissions: any;
}

class RoleService {

    private roleRepository: Repository<Role>;
    private permissionRepository: Repository<Permission>;

    constructor() {
        this.roleRepository = getCustomRepository(RoleRepository);

        this.permissionRepository = getCustomRepository(PermissionRepository);
    }

    async createRole({ name, description, permissions }: IRoleCreate) {

        const existRole = await this.roleRepository.findOne({ name });

        if (existRole)
            throw new AppError("Role already exists!");

        const existsPermissions = await this.permissionRepository.findByIds(permissions);

        if (!existsPermissions)
            throw new AppError("Permission not exists!");

        const role = this.roleRepository.create({
            name,
            description,
            permission: existsPermissions
        });

        await this.roleRepository.save(role);

        return role;
    }
}

export { RoleService };