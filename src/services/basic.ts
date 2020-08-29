import DB from "../config/db";

export class BasicSQL {
    constructor() {};

    retrieveAll = async (option: string[] = [], table: string): Promise<any[]> => {
        let items;
        try {
            if (option.length === 0) {
                items = await DB.query(`select * from ${table}`);
            } else {
                let sql = "select ";
                for (let i = 0; i < option.length; i++) {
                    sql += option[i];
                    if (i !== option.length - 1) {
                        sql += ", ";
                    }
                }
                sql += ` from ${table}`;
                items = await DB.query(sql);
            }
            return items.rows;
        } catch(err) {
            console.log(err);
        }
    }

    retrieveBy = async (condition: string, value: string, table: string): Promise<any> => {
        try {
            let item = await DB.query(
                `select * from ${table}
                where ${condition} = '${value}'`
                );
            return item.rows[0];
        } catch(err) {
            console.log(err);
        }
    }

    create = async (columns: string[] = [], values: string[], table: string): Promise<any> => {
        let sql = `insert into ${table} `;
        try {
            if (columns.length === 0) {
                sql += "values (";
            } else {
                sql += "(";
                for (let i = 0; i < columns.length; i++) {
                    sql += columns[i];
                    if (i !== columns.length - 1) {
                        sql += ", ";
                    }
                }
                sql += ") values (";
            }
            for (let j = 0; j < values.length; j++) {
                if (values[j] !== "gen_random_uuid()") {
                    sql += "'";
                    sql += values[j];
                    sql += "'";
                } else {
                    sql += values[j];
                }
                if (j !== values.length - 1) {
                    sql += ", ";
                }
            }
            sql += ") returning *";
            let result = await DB.query(sql);
            return result.rows[0];
        } catch(err) {
            console.log(err);
        }
    } 
}
