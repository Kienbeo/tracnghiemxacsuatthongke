var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    type: String
});

schema.methods.validPassword = function (password) {
    //return bCrypt.compareSync(password, this.password);
    return password == this.password;
};



var User = module.exports = mongoose.model('User', schema);

module.exports.destroy = function(req, res, next) {
    User.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                res.end('success');
            }
        }
    );
};
