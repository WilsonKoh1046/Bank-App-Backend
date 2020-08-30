import Response from "../models/Response";
import Account from "../dbModels/Account";

export class TransactionServices {
    constructor() {};

    private checkIfSufficientFund = (balance: number, amount: number): boolean => {
        return balance >= amount;
    }

    public deposit = async (id: string, amount: number): Promise<Response> => {
        try {
            let account = await Account.findOne({
                where: {
                    id: id
                }
            });
            if (account === null) {
                return {"Status": 401, "Message": "Account not found"};
            }

            await Account.increment("balance", {
                by: amount,
                where: {
                    id: id
                }
            })
            return {
                "Status": 201,
                "Message": `Successfully deposited $${amount} to account of id ${id}`
            }
        } catch(err) {
            console.log(err);
        }
    }

    public withdraw = async (id: string, amount: number): Promise<Response> => {
        try {
            let account = await Account.findOne({
                where: {
                    id: id
                }
            });
            if (account === null) {
                return {"Status": 401, "Message": "Account not found"};
            }
            if (!this.checkIfSufficientFund(account.balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }
            await Account.increment("balance", {
                by: -amount,
                where: {
                    id: id
                }
            })
            return {
                "Status": 201, 
                "Message": `Successfully withdrawn $${amount} from account of id ${id}`
            };
        } catch(err) {
            console.log(err);
        }
    }

    public transferFund = async (user_id: string, amount: number, target_email: string): Promise<Response> => {
        try {
            let sender_account = await Account.findOne({
                where: {
                    id: user_id
                }
            });

            let receiver_account = await Account.findOne({
                where: {
                    email: target_email
                }
            });
            
            if (sender_account === null || receiver_account === null) {
                return {"Status": 401, "Message": "Account(s) not found"};
            }

            if (!this.checkIfSufficientFund(sender_account.balance, amount)) {
                return {"Status": 403, "Message": "Insufficient fund"};
            }

            await Account.increment("balance", {
                by: -amount,
                where: {
                    id: user_id
                }
            });

            await Account.increment("balance", {
                by: amount,
                where: {
                    email: target_email
                }
            });
            return {
                "Status": 201, 
                "Message": `Successfully transfer $${amount} from account ${user_id} to account ${receiver_account.id}`
            };
        } catch(err) {
            console.log(err);
        }
    }
}
