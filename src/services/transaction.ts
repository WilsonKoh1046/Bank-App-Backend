import DB from "../config/db";
import Response from "../models/Response";
import { BasicSQL } from "./basic";

export class TransactionServices {
    private basicSQL: BasicSQL;
    constructor() {
        this.basicSQL = new BasicSQL();
    }

    private checkIfSufficientFund = (balance: number, amount: number): boolean => {
        return balance >= amount;
    }

    public deposit = async (id: string, amount: number): Promise<Response> => {
        try {
            let account = await this.basicSQL.retrieveBy("id", id, "accounts");
            if (account === undefined) {
                return {"Status": 401, "Message": "Account not found"};
            }
            let statement = await DB.query(
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

    public withdraw = async (id: string, amount: number): Promise<Response> => {
        try {
            let account = await this.basicSQL.retrieveBy("id", id, "accounts");
            if (account === undefined) {
                return {"Status": 401, "Message": "Account not found"};
            }
            if (!this.checkIfSufficientFund(account.balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }
            let statement = await DB.query(
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

    public transferFund = async (user_id: string, amount: number, target_email: string): Promise<Response> => {
        try {
            let sender_account = await this.basicSQL.retrieveBy("id", user_id, "accounts");

            let receiver_account = await this.basicSQL.retrieveBy("email", target_email, "accounts");
            
            if (sender_account === undefined || receiver_account === undefined) {
                return {"Status": 401, "Message": "Account(s) not found"};
            }

            if (!this.checkIfSufficientFund(sender_account.balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }

            let sender = await DB.query(
                `update accounts
                set balance = balance - ${amount}
                where id = '${user_id}'
                returning *`
                );

            let receiver = await DB.query(
                `update accounts
                set balance = balance + ${amount}
                where email = '${target_email}'
                returning *`
                );

            return {
                "Status": 201, 
                "Message": `Successfully transfer $${amount} from account ${sender.rows[0].id} to account ${receiver.rows[0].id}`
            };
        } catch(err) {
            console.log(err);
        }
    }
}
