const db = require("../config/db");
const pool = db.pool;

const getAccount = async (id) => {
    try {
        let account =  await pool.query(
            `select * from accounts 
            where id = '${id}'`
            );
        return account;
    } catch(err) {
        console.log(err);
    }
}

const checkIfSufficientFund = (balance, amount) => {
    return balance >= amount;
}

const deposit = async (id, amount) => {
    try {
        let account = await getAccount(id);
        if (account.rows.length === 0) {
            return {"Status": 401, "Message": "Account not found"};
        }
        let statement = await pool.query(
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

const withdraw = async (id, amount) => {
    try {
        let account = await getAccount(id);
        if (account.rows.length === 0) {
            return {"Status": 401, "Message": "Account not found"};
        }
        if (!checkIfSufficientFund(account.rows[0].balance, amount)) {
            return {"Status": 501, "Message": "Insufficient fund"};
        }
        let statement = await pool.query(
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

module.exports = {
    deposit,
    withdraw
}