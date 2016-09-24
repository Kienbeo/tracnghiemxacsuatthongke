var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var Answer = mongoose.Schema({
    number: Number,
    answer: String
});

var Student = mongoose.Schema({
    name: String,
    user_id: String,
    type: String,
    'answer':[Answer]
});

module.exports = mongoose.model('Student', Student);