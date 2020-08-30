import jwtGenerator from "../utils/jwtGenerator";
import passwordHasher from "../utils/passwordHasher";
import passwordChecker from "../utils/passwordChecker";
import AccountInterface from "../models/Account";
import Response from "../models/Response";
import Account from "../dbModels/Account";

export class AccountServices {
    constructor() {};

    public createAccount = async (accDetails: AccountInterface): Promise<Response> => {
        try {
            let checkAccount = await Account.findOne({
                where: {
                    email: accDetails.email
                }
            });
            
            if (checkAccount !== null) {
                return {"Status": 403, "Message": "Email not available"};
            }
            let hashedPassword = await passwordHasher(accDetails.password);
    
            await Account.create({
                username: accDetails.username,
                password: hashedPassword,
                email: accDetails.email
            });

            return {"Status": 201, "Message": `New account ${accDetails.username} is successfully created`};
        } catch(err) {
            console.log(err);
        }
    }

    public loginAccount = async (email: string, password: string): Promise<Response> => {
        try {
            let account = await Account.findOne({
                where: {
                    email: email
                }
            });
            if (account === null) {
                return {"Status": 404, "Message": "Account not found"};
            }
            let checkPassword = await passwordChecker(password, account.password);
            if (!checkPassword) {
                return {"Status": 503, "Message": "Invalid password"};
            }
            let token = await jwtGenerator(account.id);
            return {"Status": 200, "Token": token};
        } catch(err) {
            console.log(err);
        }
    }

    public retrieveAccounts = async (): Promise<AccountInterface[]> => {
        try {
            let accounts = await Account.findAll({
                attributes: ["id", "username", "email"]
            })
            return accounts;
        } catch(err) {
            console.log(err);
        }
    }

    public retrieveAccountById = async (uuid: string): Promise<AccountInterface> => {
        try {
            let account = await Account.findOne({
                where: {
                    id: uuid
                }
            });
            return account;
        } catch(err) {
            console.log(err);
        }
    }

    public updateAccount = async (accDetails: AccountInterface): Promise<Response> => {
        try {
            let account = await this.retrieveAccountById(accDetails.id);
            if (account === null) {
                return {"Status": 404, "Message": "Account not found"};
            }
            let hashedPassword = await passwordHasher(accDetails.password);
            await Account.update({
                username: accDetails.username,
                password: hashedPassword,
                email: accDetails.email
            }, {
                where: {
                    id: accDetails.id
                }
            });
    
            return {"Status": 201, "Message": `Account with id ${accDetails.id} is successfully updated`}
        } catch(err) {
            console.log(err);
        }
    }

    public deleteAccount = async (id: string): Promise<Response> => {
        try {
            let account = await this.retrieveAccountById(id);
            if (account === null) {
                return {"Status": 404, "Message": "Account not found"};
            }
            await Account.destroy({
                where: {
                    id: id
                }
            });
            return {"Status": 201, "Message": `Account with id ${id} is successfully deleted`};
            
        } catch(err) {
            console.log(err);
        }
    }
}
