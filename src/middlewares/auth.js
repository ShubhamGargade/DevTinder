const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const authTokenSecret = "DevTinder@123";

const adminAuth = async function (req, res, next) {
    try {
        const authToken = req.cookies.token;
        if(!authToken){
            throw new Error("Token is not valid.");
        }
        const verifiedData = jwt.verify(authToken, authTokenSecret);
        const { _id } = verifiedData;
        const user = await User.findById(_id);
        if(!user){
            throw new Error('User does not exists');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error in authentication " + error.message);
    }
}

module.exports = {
    adminAuth
}