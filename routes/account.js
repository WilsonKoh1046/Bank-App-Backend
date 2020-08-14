const express = require("express");
const router = express.Router();
const Authorizer = require("../middlewares/authorizer");
const services = require("../services/account");

// create account
router.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        let account = await services.createAccount(username, password, email);
        res.status(account.Status).json({"Message": account.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let result = await services.loginAccount(email, password);
        if (result.Status === 401 || result.Status === 501) {
            res.status(result.Status).json({"Message": result.Message});
        } else {
            res.status(result.Status).json({"Token": result.Token});
        }
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

// update account
router.put('/', Authorizer, async (req, res) => {
    const id = req.id;
    const { username, password, email } = req.body;
    try {
        let result = await services.updateAccount(id, username, password, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        } else {
            res.status(result.Status).json({"Info": result.Info});
        }
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
});

module.exports = router;