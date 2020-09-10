import { Router, Request, Response } from "express";
import Authorizer from "../middlewares/authorizer";
import { AccountServices } from "../services/account";
const accountServices = new AccountServices;
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    try {
        let account = await accountServices.createAccount({ username, password, email });
        res.status(account.Status).json({"Message": account.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        let result = await accountServices.loginAccount(email, password);
        if (result.Status === 401 || result.Status === 501) {
            res.status(result.Status).json({"Message": result.Message});
        } else {
            res.status(result.Status).json({"Token": result.Token});
        }
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.get('/', async (req: Request, res: Response) => {
    try {
        let result = await accountServices.retrieveAccounts();
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.get('/my-info', Authorizer, async (req: Request, res: Response) => {
    const id = req.id;
    try {
        let result = await accountServices.retrieveAccountById(id);
        if (result === null) {
            res.status(401).json({"Message": "Account not found"});
        } else {
            res.status(200).json(result);
        }
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.put('/', Authorizer, async (req: Request, res: Response) => {
    const id = req.id;
    const { username, password, email } = req.body;
    try {
        let result = await accountServices.updateAccount({ id, username, password, email} );
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

export default router;