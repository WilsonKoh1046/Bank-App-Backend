import * as dotenv from "dotenv";
dotenv.config();

// DB
export const dbUser: string = process.env.USER;
export const dbPassword: string = process.env.PASSWORD;
export const dbDatabase: string = process.env.DATABASE;
export const dbHost: string = process.env.HOST;
export const dbPort: number = parseInt(process.env.PORT);

// JWT
export const secretKey: string = process.env.JWTSECRET;

// Bcrypt
export const saltRound: number = parseInt(process.env.SALTROUND);
