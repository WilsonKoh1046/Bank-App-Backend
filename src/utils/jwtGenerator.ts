import * as JWT from "jsonwebtoken";
import Claims from "../models/Claims";
import { secretKey } from "../config/configuration";

export default async (account_id: string): Promise<string> => {

    // create claim using id
    const claim: Claims  = { 
        id: account_id
    }

    const option = {
        expiresIn: '1h'
    }

    return new Promise((resolve, reject) => {
        try {
            let output = JWT.sign(claim, secretKey, option);
            resolve(output);
        } catch(err) {
            reject(err);
        }
    })
}