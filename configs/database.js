const mongoose = require("mongoose")

exports.connect = (MONGO_URI) => {
	// Connect to the mongo database thats listed in env
	mongoose
		.connect(MONGO_URI, {
			useNewUrlParser : true,
			useUnifiedTopology : true
		})
		.then(() => {
			console.log("Connected to DB Successfully")
		})
		.catch(error => {
			console.log("database connection failed. exiting now.....")
			console.error(error)
			process.exit(1)
		})
}