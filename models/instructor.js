var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');


var Instructor = mongoose.Schema({
    name: String,
    user_id: String,
    type: String
});

module.exports = mongoose.model('Instructor', Instructor);