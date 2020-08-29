import { Pool } from "pg";
import { 
    dbUser,
    dbHost,
    dbDatabase,
    dbPassword,
    dbPort
 } from "./configuration";

export default new Pool({
    user: dbUser,
    host: dbHost,
    database: dbDatabase,
    password: dbPassword,
    port: dbPort
})
