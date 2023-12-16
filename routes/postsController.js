const express = require("express")
const app = express()
const MAX_TIME = 3600
const Post = require("../models/post")
const Image = require("../models/image")
const auth = require("../middleware/auth")

//display all posts in /home

//only verified users can create posts
app.post("/post" , auth , (req, res) => {
	const user = req.user.username //OP
	const { image , title, text } = req.body // image & content


	//no inputs
	if(!title || !text){
		console.log("No inputs recieved")
		return res.status(400).json("No information for post")
	}

	//create post
	Post.create({
		OP : user,
		title : title,
		text : text
	})		
	
	if(image){
			//create image object with schema and assign it to this post
		console.log("Creating image object")
	}

	res.status(200).json("post created successfuly")

})

//anyone can get post information do not need to be logged in
app.get("/post/:id" , async (req, res) => {

	var id = req.params.id
	try {
		const post = await Post.findById(id)
		return res.status(200).json(post)

	}
	catch (err){
			console.log("error finding post")
			console.log(err)
			return res.status(400).json(err ,"error finding post")
		}

})

//update post object with comments
app.patch("/post/:id/comment" , auth , async(req , res) => {

	const user = req.user.username
	var id = req.params.id
	var { comment } = req.body
	// verify inputs
	if(comment){
		// make sure post exists before adding a comment to it
		const post = await Post.findById(id)
		if(post){
			// create comment and save
			let newComment = { user : user, comment : comment, upvotes : 0, downvotes : 0}
			post.comments.push(newComment)
			post.save()
			return res.status(200).json("comment saved succefully")
		}
		console.log("error post does not exist")
		return res.status(400).json("This post does not exist")
	}
	console.log("error no comment provided")
	return res.status(400).json("no comment provided")

})

//upvote
app.patch("/post/:id/upvote" , auth , (req, res) => {

	var id = req.params.id
		// make sure post exists before adding a comment to it
		const post = Post.findById(id).then( post => {
			post.upvotes += 1
			post.save()
		}).catch(err => {
			console.log("error post does not exist")
		})
	console.log("upvoted")
	return res.status(200).json("upvoted")
})

app.patch("/post/:id/downvote" , auth , (req, res) => {

	var id = req.params.id
	// make sure post exists before adding a comment to it
	const post = Post.findById(id).then( post => {
		post.downvotes += 1
		post.save()
	}).catch(err => {
		console.log("error post does not exist")
	})
	console.log("downvoted")
	return res.status(200).json("downvoted")

})
/*
//extended features 
//delete users post
app.delete("/post/:id" , auth , (req, res) => {

})

//delete comments of users
app.delete("/post/:id/comment" ,auth, (req , res) => {

})
*/
module.exports = app