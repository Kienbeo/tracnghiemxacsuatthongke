var mongoose = require('mongoose');

var Unit = mongoose.Schema({
    number: Number,
    name: String,
    content: String,
    type1: Boolean,
    type2: Boolean,
    answer: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String
});

var Topic = mongoose.Schema({
    name: String,
    instructor_id: String,
    number: String,
    'unit':[Unit]
});

var Topic = module.exports = mongoose.model('Topic', Topic);

module.exports.destroy = function(req, res, next) {
    Topic.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                res.end('success');
            }
        }
    );
};