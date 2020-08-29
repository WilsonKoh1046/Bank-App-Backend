import * as bcrypt from "bcrypt";

export default async (plain_text_password: string, hashed_password: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(plain_text_password, hashed_password);
    } catch(err) {
        console.log(err);
    }
}