const mongoose = require("mongoose")

const postSchema = new mongoose.Schema( {
    OP : {type : String , required : true},
    upvotes :  {type : Number, default : 0 } ,
    downvotes : {type : Number, default : 0 } ,
    imgId : String,
	title : { type : String, required : true},
	text :  { type : String, required : true},
    comments : [{
        user : String,
        comment : String,
        upvotes : {type : Number, default : 0 },
        downvotes : {type : Number, default : 0 }
    }]

}, {timestamps : true});

module.exports = mongoose.model("Post" , postSchema)