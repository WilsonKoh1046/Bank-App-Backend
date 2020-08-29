import { Router, Response, Request } from "express";
import Authorizer from "../middlewares/authorizer";
import { TransactionServices } from "../services/transaction";
const transactionServices = new TransactionServices();
const router = Router();

router.put('/', Authorizer, async (req: Request, res: Response) => {
    const id = req.id;
    const { amount, mode } = req.body;
    let result;
    try {
        if (mode === "deposit") {
            result = await transactionServices.deposit(id, amount);
        } else if (mode === "withdraw") {
            result = await transactionServices.withdraw(id, amount);
        } else {
            res.status(501).json({"Message": "Requested service not available"});
        }
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

router.put('/transfer', Authorizer, async (req: Request, res: Response) => {
    const user_id = req.id;
    const { target_email, amount } = req.body;
    try {
        let result = await transactionServices.transferFund(user_id, amount, target_email);
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

export default router;