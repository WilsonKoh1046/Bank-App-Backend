const bcrypt = require("bcrypt");
const config = require("../config/configuration");

module.exports = async (password) => {
    try {
        let salt = await bcrypt.genSalt(config.saltRound);
        let hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch(err) {
        console.log(err);
    }
}