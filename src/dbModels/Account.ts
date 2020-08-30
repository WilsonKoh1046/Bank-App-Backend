import { Model, DataTypes, Optional, UUIDV4 } from "sequelize";
import sequelize from "../config/db";
import AccountAttributes from "../models/Account";

interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {};

class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public balance!: number;
}

Account.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: "accounts",
    timestamps: false
})

export default Account;