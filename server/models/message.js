let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
	author: String,
	text: String
})

module.exports = mongoose.model('Message', MessageSchema);