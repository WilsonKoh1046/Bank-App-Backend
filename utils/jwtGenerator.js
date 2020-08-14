const JWT = require("jsonwebtoken");
const config = require("../config/configuration");

module.exports = (account_id) => {

    // create claim using id
    const claim = { 
        id: account_id
    }

    const option = {
        expiresIn: '1h'
    }

    return new Promise((resolve, reject) => {
        try {
            let output = JWT.sign(claim, config.secretKey, option);
            resolve(output);
        } catch(err) {
            reject(err);
        }
    })
}