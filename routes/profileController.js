const express = require("express")
const app = express()
const auth = require("../middleware/auth")
const Post = require("../models/post")
const User = require("../models/user")
const bycrypt = require('bcryptjs')
const Image = require("../models/image")


// get profile get all posts from user
app.get("/profile" , auth , async(req , res) => {

	const username = req.user.username
	if(!username){
		return res.send(400).json("error no username")
	}

	try {
		const posts = await Post.find({OP : username })
		return res.status(200).json(posts)
	}
	catch(err){
		return res.status(400).send(err)
	}

})

//update password
app.patch("/profile/changepassword" , auth , async(req , res) => {

	const username = req.user.username

	const {oldPassword , newPassword} = req.body
	if(!username || !oldPassword || !newPassword){
		return res.send(400).json("error missing input")
	}

	// find the user then compare hashed password
	// if it's correct then we will allow the change
	// change password in database
	try{
		const user = await User.findOne({username})
		if ( await bycrypt.compare(user.password)) {
			console.log("user password is correct.....")
			user.password = bycrypt.hash(newPassword, 10)
			user.save()
			console.log("password has been changed")
			return res.status(200).json("password has been changed")
		}
		return res.status(400).json("password is incorrect")

	}
	catch(err){
		return res.status(400).send(err)
	}

})

//update email
app.patch("/profile/changeemail" , auth , async(req , res) => {

	const username = req.user.username

	const {password, newEmail }= req.body
	if(!username || !password || !newEmail){
		return res.send(400).json("error missing input")
	}

	// find the user then compare hashed password
	// if it's correct then we will allow the change
	// change password in database
	try{
		const user = await User.findOne({username})
		if ( await bycrypt.compare(user.password)) {
			//check if user email already exists
			if (await User.findOne({ email: newEmail })) {
				console.log("hey that email has already been used")
				console.log(newEmail)
				return res.status(400).json("email already exists")
			}
			console.log("user password is correct && Email is not already in use.....")
			user.email = newEmail
			user.save()
			console.log("Email has been changed")
			return res.status(200).json("Email has been changed")
		}
		return res.status(400).json("password is incorrect")

	}
	catch(err){
		return res.status(400).send(err)
	}

})
/*
//see all posts youve interacted with likes&dislikes | commented

app.get("/profile/allPosts", auth , (req , res) => {

})
app.get("/profile/CommentsandLikes" , auth , (req , res) => {
	
})
*/
module.exports = app