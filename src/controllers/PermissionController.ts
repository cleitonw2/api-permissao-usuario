import { Request, Response } from "express";
import { PermissionService } from "../services/PermissionService";

const permissionService = () => new PermissionService();

class PermissionController {
    async create(req: Request, res: Response) {
        const { name, description } = req.body;

        const permission = await permissionService().createPermission(name, description);

        return res.status(200).json(permission);
    }

    async update(req: Request, res: Response) {
        const { name, description } = req.body;
        const { permission_id } = req.params;
        await permissionService().updatePermission(permission_id, name, description);
        res.json("ok")
    }

    async delete(req: Request, res: Response) {
        const { permission_id } = req.params;

        await permissionService().delete(permission_id);

        return res.json("permission deleted");
    }
}

export { PermissionController };