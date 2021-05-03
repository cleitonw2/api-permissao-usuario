import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { UserService } from "../services/UserService";
import * as yup from "yup";


const userService = () => new UserService();

class UserController {

    async create(req: Request, res: Response) {
        const { name, email, password, roles } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            password: yup.string().length(6).required(),
            email: yup.string().email().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.message);
        }

        const user = await userService().create({ name, email, password, roles });

        return res.status(200).json(user);
    }

    async login(req: Request, res: Response) {

        const { email, password } = req.body;

        const { user, token } = await userService().login(email, password);

        return res.status(200).json({ user: user, token: token });
    }

    async show(req: Request, res: Response) {

        const userService = new UserService();

        const users = await userService.showUsers();

        return res.status(200).json(users);
    }

    async showUserByID(req: Request, res: Response) {
        const id = req.header;
        
        const user = await userService().showUserByID(String(id));

        user.password = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        res.status(200).send(user);
    }

    async updateUser(req: Request, res: Response) {
        const id = req.header;
        const { name, email} = req.body;
        const user_id = String(id);
        
        await userService().updateUser(user_id, name, email);

        return res.json("user successfully updated!");
    }

    async updatedPassword(req: Request, res: Response) {
        const { password, newPassword } = req.body;
        const id = String(req.header);

        const userID = await userService().updatePassword(password, newPassword, id);

        return res.status(200).json({ message: "Password successfully updated", id: userID });
    }

    async delete(req: Request, res: Response) {
        const id = String(req.header);
        const { password } = req.body;

        const user = await userService().deleteUser(password, id);

        return res.status(200).json("User successfully deleted!");
    }

    async reset_password(req: Request, res: Response) {
        const { email, token, password } = req.body;

        await userService().resetPassword(email, token, password);

        return res.status(200).json({ message: "Password successfully updated" });
    }
}

export default new UserController();