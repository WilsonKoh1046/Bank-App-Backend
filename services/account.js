const db = require("../config/db");
const pool = db.pool;
const passwordHasher = require("../utils/passwordHasher");
const passwordChecker = require("../utils/passwordChecker");
const jwtGenerator = require("../utils/jwtGenerator");

const createAccount = async (username, password, email) => {
    try {
        let checkAccount = await pool.query(
            `select * from accounts 
            where email = '${email}'`
            )
        
        if (checkAccount.rows.length > 0) {
            return {"Status": 501, "Message": "Email not available"};
        }
        let hashedPassword = await passwordHasher(password);

        let account = await pool.query(
            `insert into accounts (id, username, password, email)
            values (gen_random_uuid(), '${username}', '${hashedPassword}', '${email}')
            returning *`
            );
        return {"Status": 201, "Message": `New account with id ${account.rows[0].id} is successfully created`};
    } catch(err) {
        console.log(err);
    }
}

const loginAccount = async (email, password) => {
    try {
        let account = await pool.query(
            `select * from accounts
            where email = '${email}'`
            );
        if (account.rows.length === 0) {
            return {"Status": 401, "Message": "Account not found"};
        }
        let checkPassword = await passwordChecker(password, account.rows[0].password);
        if (!checkPassword) {
            return {"Status": 501, "Message": "Invalid password"};
        }
        let token = await jwtGenerator(account.rows[0].id);
        return {"Status": 200, "Token": token};
    } catch(err) {
        console.log(err);
    }
}

const retrieveAccounts = async () => {
    try {
        let accounts = await pool.query(`select * from accounts`);
        return accounts.rows;
    } catch(err) {
        console.log(err);
    }
}

const retrieveAccountById = async (uuid) => {
    try {
        let account = await pool.query(
            `select * from accounts
            where id = '${uuid}'`
            );
        return account.rows[0];
    } catch(err) {
        console.log(err);
    }
}

const updateAccount = async (id, username, password, email) => {
    try {
        let account = await pool.query(
            `select * from accounts
            where id = '${id}'`
            );
        if (account.rows.length === 0) {
            return {"Status": 401, "Message": "Account not found"};
        }
        let hashedPassword = await passwordHasher(password);
        let updatedAccount = await pool.query(
            `update accounts 
            set id = gen_random_uuid(),
            username = '${username}',
            password = '${hashedPassword}',
            email = '${email}'
            where id = '${id}'
            returning *`
            );

        return {"Status": 201, "Info": updatedAccount.rows[0]}
    } catch(err) {
        console.log(err);
    }
}

const deleteAccount = async (id) => {
    try {
        let account = await pool.query(
            `select * from accounts
            where id = '${id}'`
            );
        if (account.rows.length === 0) {
            return {"Status": 401, "Message": "Account not found"};
        }

        let deletedAccount = await pool.query(
            `delete from accounts
            where id = '${id}'
            returning *`
            );
        return {"Status": 201, "Info": deletedAccount.rows[0]};
        
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    createAccount,
    loginAccount,
    retrieveAccounts,
    retrieveAccountById,
    updateAccount,
    deleteAccount
}
