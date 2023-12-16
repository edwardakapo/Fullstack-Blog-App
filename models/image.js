const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
	data : Buffer,
	contentType : String

})


module.exports = mongoose.model("Image" , imageSchema)
