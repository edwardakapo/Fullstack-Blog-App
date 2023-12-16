const jwt = require("jsonwebtoken")
require("dotenv").config()
const  { APP_TOKEN } = process.env



const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt
    console.log(token)
    if(!token) {
        console.log("token invalid")
        return res.status(403).json("A token is requried for authentication")
    }
    jwt.verify(token , APP_TOKEN , function(err , decoded) {
        if(err) return res.status(401).json({msg : err , errMsg : "invalid token - render invalid token page" })
        console.log("token is valid")
        console.log(decoded.username)
        req.user = decoded
        next()
    })

    //Add refresh token logic 
        // logged in and token is good 1 1
        // logged in and token is expired 1 0
        // logged out and token is good 0 1 
        // logged out and token is expired 0 0



}

module.exports = verifyToken 
