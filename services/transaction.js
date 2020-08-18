const pool = require("../config/db");

class Transaction {
    constructor() {
        this._DB = pool;
    }

    async _getAccount(id) {
        try {
            let account =  await this._DB.query(
                `select * from accounts 
                where id = '${id}'`
                );
            return account;
        } catch(err) {
            console.log(err);
        }
    }

    _checkIfSufficientFund(balance, amount) {
        return balance >= amount;
    }

    async deposit(id, amount) {
        try {
            let account = await this._getAccount(id);
            if (account.rows.length === 0) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let statement = await this._DB.query(
                `update accounts
                set balance = balance + ${amount}
                where id = '${id}'
                returning *`
                );
            return {
                "Status": 201,
                "Message": `Successfully deposited $${amount} to account of id ${id}, current balance: $${statement.rows[0].balance}`
            }
        } catch(err) {
            console.log(err);
        }
    }

    async withdraw(id, amount) {
        try {
            let account = await this._getAccount(id);
            if (account.rows.length === 0) {
                return {"Status": 401, "Message": "Account not found"};
            }
            if (!this._checkIfSufficientFund(account.rows[0].balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }
            let statement = await this._DB.query(
                `update accounts
                set balance = balance - ${amount}
                where id = '${id}'
                returning *`
                );
            return {
                "Status": 201, 
                "Message": `Successfully withdrawn $${amount} from account of id ${id}, current balance: $${statement.rows[0].balance}`
            };
        } catch(err) {
            console.log(err);
        }
    }

    async transferFund(user_id, amount, target_email) {
        try {
            let sender_account = await this._getAccount(user_id);

            let receiver_account = await this._DB.query(
                `select * from accounts
                where email = '${target_email}'`
                );
            
            if (sender_account.rows.length === 0 || receiver_account.rows.length === 0) {
                return {"Status": 401, "Message": "Account(s) not found"};
            }

            if (!this._checkIfSufficientFund(sender_account.rows[0].balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }

            let sender = await this._DB.query(
                `update accounts
                set balance = balance - ${amount}
                where id = '${user_id}'
                returning *`
                );

            let receiver = await this._DB.query(
                `update accounts
                set balance = balance + ${amount}
                where email = '${target_email}'
                returning *`
                );

            return {
                "Status": 201, 
                "Message": `Successfully transfer $${amount} from account ${user_id} to account ${receiver.rows[0].id}`
            };
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Transaction();