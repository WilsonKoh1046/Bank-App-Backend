import * as bcrypt from "bcrypt";
import { saltRound } from "../config/configuration";

export default async (password: string): Promise<string> => {
    try {
        let salt = await bcrypt.genSalt(saltRound);
        let hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch(err) {
        console.log(err);
    }
}