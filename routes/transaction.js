const express = require("express");
const router = express.Router();
const Authorizer = require("../middlewares/authorizer");
const services = require("../services/transaction");

router.put('/', Authorizer, async (req, res) => {
    const id = req.id;
    const { amount, mode } = req.body;
    let result;
    try {
        if (mode === "deposit") {
            result = await services.deposit(id, amount);
        } else if (mode === "withdraw") {
            result = await services.withdraw(id, amount);
        } else {
            res.status(501).json({"Message": "Requested service not available"});
        }
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

router.put('/transfer', Authorizer, async (req, res) => {
    const user_id = req.id;
    const { target_email, amount } = req.body;
    try {
        let result = await services.transferFund(user_id, amount, target_email);
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

module.exports = router;
