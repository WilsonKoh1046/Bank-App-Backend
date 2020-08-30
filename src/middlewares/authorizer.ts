import * as JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Claims from "../models/Claims";
import { secretKey } from "../config/configuration";

export default async (req: Request, res: Response, next: NextFunction) => {
    let token = req.header("Authorization");
    if (!token) {
        res.status(401).json({"Message": "Access Denied"});
    }

    const validateToken = (provided_token: string): Promise<Claims> => {
        return new Promise((resolve, reject) => {
            JWT.verify(provided_token, secretKey, (err, token: Claims) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            })
        })
    }

    try {
        let decoded_token = await validateToken(token);
        req.id = decoded_token.id;
        next();
    } catch(err) {
        res.status(401).json({"Message": "Invalid token"});
    }
}