// Middleware for auth

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        if(req.headers.authorization)
        {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        }
        else{
            res.status(400).json({
                status:"Unauthorized",
                message:"No token passed"
            })
        }
    } catch (error) {
        res.status(401).json({ message: "No token cannot authorize" });
    }
};