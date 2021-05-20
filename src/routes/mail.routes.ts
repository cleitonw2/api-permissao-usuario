import { Router } from 'express';
import { SendMailController } from "../controllers/SendMailController";



const router = Router();

const sendMailController = new SendMailController();

router.patch(
    "/forgot_password",
    sendMailController.forgot_password
);

export default router;