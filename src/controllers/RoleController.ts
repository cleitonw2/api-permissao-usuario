import { Request, Response } from "express";
import { RoleService } from "../services/RoleService";

const roleService = () => new RoleService();

class RoleController {
    async create(req: Request, res: Response) {
        const { name, description, permissions } = req.body;

        const role = await roleService().createRole({ name, description, permissions });

        return res.status(200).json(role);
    }
}

export default new RoleController();