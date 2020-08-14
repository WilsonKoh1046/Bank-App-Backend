const JWT = require("jsonwebtoken");
const config = require("../config/configuration");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        res.status(401).json({"Message": "Access denied"});
    }

    const decodeToken = (provided_token) => {
        return new Promise((resolve, reject) => {
            try {
                const decodedToken = JWT.verify(provided_token, config.secretKey);
                resolve(decodedToken);
            } catch(err) {
                reject(err);
            }
        })
    }

    try {
        const decodedToken = await decodeToken(token);
        // storing the decoded token into req object to be used later
        req.id = decodedToken.id;
        next();
    } catch(err) {
        res.status(401).json({"Message": "Invalid token"});
    }
}