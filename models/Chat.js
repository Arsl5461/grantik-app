var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
    roomId: String,
    message: String,
    user: String,
    time: String
}, { timestamps: true });

mongoose.model('Chat', ChatSchema); ``