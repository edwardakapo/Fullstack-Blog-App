const express = require("express")
const mongoDatabase = require("./configs/database")
const app = express()
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
require("dotenv").config()
const  { APP_TOKEN } = process.env
//load .env files by default
require("dotenv").config()

const { MONGO_URI } = process.env

//middleware
app.use(express.json())
app.use(cookieParser())
const authController = require('./routes/authController')
const postController = require("./routes/postsController")
const profileController = require("./routes/profileController")

const auth = require("./middleware/auth")
app.use(authController)
app.use(postController)
app.use(profileController)
mongoDatabase.connect(MONGO_URI)

const port = process.env.PORT || 3000;

function verifyLoggedIn(token) {
    jwt.verify(token , APP_TOKEN , function(err , decoded) {
   	if(err) return false
	return true
})
};

const testData = [ 
	{ 
		username : "edward" ,
		information : "only for edward"
	},
	{ 
		username : "jimmy" ,
		information : "only for jimmy"
	},

]
app.post("/welcome" , auth , (req , res) => {
	res.status(200).json("AUTH is working")
})

app.get('/', (req, res) => {
	if(verifyLoggedIn(req.cookies)){

		res.status(200).json(testData.filter( data => data.username === req.user.username))
	}
		res.status(200).json("Need to Login")

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)	
})