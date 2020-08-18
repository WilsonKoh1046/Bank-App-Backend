const pool = require("../config/db");
const passwordHasher = require("../utils/passwordHasher");
const passwordChecker = require("../utils/passwordChecker");
const jwtGenerator = require("../utils/jwtGenerator");

class Account {
    constructor() {
        this._DB = pool;
        this._PasswordHasher = passwordHasher;
        this._PasswordChecker = passwordChecker;
        this._JWTGenerator = jwtGenerator;
    }

    async createAccount(username, password, email) {
        try {
            let checkAccount = await this._DB.query(
                `select * from accounts 
                where email = '${email}'`
                )
            
            if (checkAccount.rows.length > 0) {
                return {"Status": 501, "Message": "Email not available"};
            }
            let hashedPassword = await this._PasswordHasher(password);
    
            let account = await this._DB.query(
                `insert into accounts (id, username, password, email)
                values (gen_random_uuid(), '${username}', '${hashedPassword}', '${email}')
                returning *`
                );
            return {"Status": 201, "Message": `New account with id ${account.rows[0].id} is successfully created`};
        } catch(err) {
            console.log(err);
        }
    }

    async loginAccount(email, password) {
        try {
            let account = await this._DB.query(
                `select * from accounts
                where email = '${email}'`
                );
            if (account.rows.length === 0) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let checkPassword = await this._PasswordChecker(password, account.rows[0].password);
            if (!checkPassword) {
                return {"Status": 501, "Message": "Invalid password"};
            }
            let token = await this._JWTGenerator(account.rows[0].id);
            return {"Status": 200, "Token": token};
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveAccounts() {
        try {
            let accounts = await this._DB.query(`select * from accounts`);
            return accounts.rows;
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveAccountById(uuid) {
        try {
            let account = await this._DB.query(
                `select * from accounts
                where id = '${uuid}'`
                );
            return account.rows[0];
        } catch(err) {
            console.log(err);
        }
    }

    async updateAccount(id, username, password, email) {
        try {
            let account = await this._DB.query(
                `select * from accounts
                where id = '${id}'`
                );
            if (account.rows.length === 0) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let hashedPassword = await this._PasswordHasher(password);
            let updatedAccount = await this._DB.query(
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

    async deleteAccount(id) {
        try {
            let account = await this._DB.query(
                `select * from accounts
                where id = '${id}'`
                );
            if (account.rows.length === 0) {
                return {"Status": 401, "Message": "Account not found"};
            }
    
            let deletedAccount = await this._DB.query(
                `delete from accounts
                where id = '${id}'
                returning *`
                );
            return {"Status": 201, "Info": deletedAccount.rows[0]};
            
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Account();