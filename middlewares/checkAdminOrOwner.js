// Middleware for admin

const jwt = require("jsonwebtoken");
const userSchema = require('../models/userSchema');


module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const liveUser = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(liveUser)
            const user = await userSchema.findById(liveUser.id).select('role')
            console.log(user)
            if (user && user.role === 1 || user.role === 2 || user.role === 4) {
                next();
            }
            else {
                res.status(401).json({
                    status: "error",
                    message: "You are not authorized for this action"
                })
            }
        }
        else {
            res.status(400).json({
                status: "Unauthorized",
                message: "No token passed"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred" + error });
    }
};