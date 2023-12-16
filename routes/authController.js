const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require("dotenv").config()
const MAX_TIME = 3600
const  { APP_TOKEN } = process.env


router.route('/login')
.get( (req, res, next) => {
    if(req.cookies.hasOwnProperty('jwt') && req.cookies.jwt !== ''){
        return res.status(400).json("user is already logged out")
    }
    console.log('Login route')
    res.status(200).json('This is the login page from the login route')
})
.post( async (req,res) => {
    // login logic
    try {
        const {username , password} = req.body;

        //validate && sanitize inputs
        if(!username || !password) {
            return res.status(400).json("missing username or password")
        }

        //validate user existence from DB 
        const user = await User.findOne({ username : username })
        console.log("here")
        if(user){
            console.log("user found")
            console.log(user)
        }
        else {
            console.log("user does not exist page should be re-rendered")
            return res.status(400).json("invalid user or password")
        }

        // if user is already logged in redirect
        if (user.isActive){
            //return res.status(400).json("this user is already logged in")
        }

        //check hashed password
        if (await bcrypt.compare(password, user.password)){
            console.log("fully verified create token and save to db")
            // if true create and save jwt
            const token = jwt.sign (
                { username : username } , APP_TOKEN , {expiresIn: MAX_TIME}
            );
            user.isActive = true;
            user.save()
            res.cookie('jwt' , token , {httpOnly : true , maxAge : MAX_TIME * 1000})
            res.status(200).json({TOKEN : token , userObj : user})
        }
        else {
            console.log("password incorrect")
            res.status(400).json('invalid user or password')
        }
    }
    catch (err){
        console.log(err)
        return res.status(500).json("error with login")
    }

})

router.route("/register")
.get((req , res) => {
    console.log("register route")
    res.status(200).json("User Register page")
})
.post(async (req , res) => {
    //get user input
    try {
        const { username , email , password } = req.body
        if (!username || !email || !password){
            console.log(req.body)
            return res.status(400).json("incorrect form submission... all inputs are required")
        } 
        //sanitize inputs
        //check if user already exists
        const oldUser = await User.findOne({username : username})
        if(oldUser){
            console.log("hey that user already exists")
            console.log(oldUser)
            return res.status(400).json("user already exists")
        }

        //check if user email already exists
        const oldEmail = await User.findOne({ email : email })
        if (oldEmail) {
            console.log("hey that email has already been used")
            console.log(oldEmail)
            return res.status(400).json("email already exists")
        }
        //if not create user hash password
        console.log("creating new user...")
        let encryptedPassword = await bcrypt.hash(password, 10)
        console.log("password encrypted", encryptedPassword)
        const user = await User.create({
            username : username,
            email : email.toLowerCase(),
            password : encryptedPassword,
            isActive : true
        })
        console.log("user created" , user)
        const token = jwt.sign(
            {username : username} , APP_TOKEN , {expiresIn : MAX_TIME}
        )
        console.log('saving user to database')
        await user.save()
        res.cookie('jwt' , token , {httpOnly : true , maxAge : MAX_TIME * 1000})
        res.status(201).json({TOKEN : token , userObj : user})
        console.log("user created")


    }
    catch (err){
        console.log(err)
        res.status(500).json({errMsg : err ,
        systemMsg : "error with creating user.. pls try again"})
    }

})

router.route("/logout")
.get((req ,res) => {
    res.status(200).json("Logout PAGE")
})
.post((req , res) => {
    try{
        if(!req.cookies.hasOwnProperty('jwt') || req.cookies.jwt === ''){
            return res.status(400).json("user is already logged out")
        }
        const token = req.cookies.jwt
        //get user from jwt
        jwt.verify(token , APP_TOKEN , async function(err , decoded) {
            if(err) return res.status(401).json({msg : err , errMsg : "invalid token - render invalid token page" })
            console.log("token is valid")
        //inform server that the user is not active 
            const user = await User.findOne({ username : decoded.username})
            user.isActive = false 
            user.save()
            console.log("updated user object on logout")
        })

        //clear the cookie
        res.clearCookie('jwt');
        res.status(200).send('cookie deleted');

        

    }
    catch (err) {
        console.log(err)
        res.status(500).json({errMsg : err ,
        systemMsg : "error with logging out user.. pls try again"})
    }

})

module.exports = router