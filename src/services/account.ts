import DB from "../config/db";
import jwtGenerator from "../utils/jwtGenerator";
import passwordHasher from "../utils/passwordHasher";
import passwordChecker from "../utils/passwordChecker";
import Account from "../models/Account";
import Response from "../models/Response";
import { BasicSQL } from "./basic";

export class AccountServices {
    private basicSQL: BasicSQL;
    constructor() {
        this.basicSQL = new BasicSQL();
    }

    public createAccount = async (accDetails: Account): Promise<Response> => {
        try {
            let checkAccount = await this.basicSQL.retrieveBy("email", accDetails.email, "accounts");
            
            if (checkAccount !== undefined) {
                return {"Status": 501, "Message": "Email not available"};
            }
            let hashedPassword = await passwordHasher(accDetails.password);
    
            let account = await this.basicSQL.create(
                ["id", "username", "password", "email"], 
                ["gen_random_uuid()", `${accDetails.username}`, `${hashedPassword}`, `${accDetails.email}`],
                "accounts"
                );

            return {"Status": 201, "Message": `New account with id ${account.id} is successfully created`};
        } catch(err) {
            console.log(err);
        }
    }

    public loginAccount = async (email: string, password: string): Promise<Response> => {
        try {
            let account = await this.basicSQL.retrieveBy("email", email, "accounts");
            if (account === undefined) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let checkPassword = await passwordChecker(password, account.password);
            if (!checkPassword) {
                return {"Status": 501, "Message": "Invalid password"};
            }
            let token = await jwtGenerator(account.id);
            return {"Status": 200, "Token": token};
        } catch(err) {
            console.log(err);
        }
    }

    public retrieveAccounts = async (): Promise<Account[]> => {
        try {
            let accounts = await this.basicSQL.retrieveAll(["id", "name", "email"], "accounts");
            return accounts;
        } catch(err) {
            console.log(err);
        }
    }

    public retrieveAccountById = async (uuid: string): Promise<Account> => {
        try {
            let account = await this.basicSQL.retrieveBy("id", uuid, "accounts");
            return account;
        } catch(err) {
            console.log(err);
        }
    }

    public updateAccount = async (accDetails: Account): Promise<Response> => {
        try {
            let account = await this.basicSQL.retrieveBy("id", accDetails.id, "accounts");
            if (account === undefined) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let hashedPassword = await passwordHasher(accDetails.password);
            let updatedAccount = await DB.query(
                `update accounts 
                set id = gen_random_uuid(),
                username = '${accDetails.username}',
                password = '${hashedPassword}',
                email = '${accDetails.email}'
                where id = '${accDetails.id}'
                returning *`
                );
    
            return {"Status": 201, "Message": updatedAccount.rows[0]}
        } catch(err) {
            console.log(err);
        }
    }

    public deleteAccount = async (id: string): Promise<Response> => {
        try {
            let account = await this.basicSQL.retrieveBy("id", id, "accounts");
            if (account === undefined) {
                return {"Status": 401, "Message": "Account not found"};
            }
    
            let deletedAccount = await DB.query(
                `delete from accounts
                where id = '${id}'
                returning *`
                );
            return {"Status": 201, "Message": deletedAccount.rows[0]};
            
        } catch(err) {
            console.log(err);
        }
    }
}
