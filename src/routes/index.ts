import { Router } from "express";
import userRouter from "./users.routes";
import permissionsRolesRouter from "./permissions.roles.routes";
import productRouter from "./product.routes";
import mailRouter from "./mail.routes";
import sellerRouter from "./seller.routes";
import productAffiliateRouter from "./productAffiliate.routes";


const router = Router();

router.use(userRouter);
router.use(permissionsRolesRouter);
router.use(productRouter);
router.use(mailRouter);
router.use(sellerRouter);
router.use(productAffiliateRouter);

export { router };

