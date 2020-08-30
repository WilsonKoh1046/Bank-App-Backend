import { Sequelize } from "sequelize";
import { 
    dbUser,
    dbHost,
    dbDatabase,
    dbPassword
 } from "./configuration";

export default new Sequelize(dbDatabase, dbUser, dbPassword, {
    host: dbHost,
    dialect: "postgres"
})
