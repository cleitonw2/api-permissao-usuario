import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { is } from "../middlewares/permission";


const router = Router();

const userController = new UserController();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN";

router.post("/users", userController.create);
router.post("/login", userController.login);
router.post("/reset_password", userController.reset_password);
router.put("/update_user", is([user, admin]), userController.updateUser);
router.patch("/update_password", is([user, admin]), userController.updatedPassword);
router.get("/show", is([admin]), userController.show);
router.get("/show/id", is([admin, user]), userController.showUserByID);
router.delete("/user", is([admin, user]), userController.delete);

export default router;
