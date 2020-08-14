require("dotenv").config();

// DB
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const host = process.env.HOST;
const port = process.env.PORT;

// JWT
const secretKey = process.env.JWTSECRET;

// Bcrypt
const saltRound = parseInt(process.env.SALTROUND);

module.exports = {
    user,
    password,
    database,
    host,
    port,
    secretKey,
    saltRound
}