import { Router } from 'express';
import { SellerController } from "../controllers/SellerController";
import { is } from "../middlewares/permission";


const router = Router();

const user = "ROLE_USER";
const admin = "ROLE_ADMIN";

const sellerController = new SellerController();

router.get(
    "/:user_id",
    //is([admin]),
    sellerController.getSellerID
);
//generate report of all sellers

router.post(
    "/generate/report",
    is([admin]),
    sellerController.generateSellersReport
);

//generate report from a seller 
router.get(
    "/generate/report/:user_id",
    is([admin, user]),
    sellerController.generateSellerReport
);

router.post(
    "/pdf/seller",
    is([admin, user]),
    sellerController.getSellerPDF
);

export default router;