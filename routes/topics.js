var express = require('express');
var router = express.Router();

var Topic = require('../models/topic');

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/creater', ensureAuthenticated, function (req, res, next) {
    var m_user = req.user;
    if(m_user.type=="instructor"){
        res.render('topic/creater', {'title': 'Create topic'});
    } else {
        res.redirect('/topics/alloftopics');
    }
});

router.post('/creater', function (req, res, next) {
    var m_topic = new Topic({
        number: req.body.number,
        name: req.body.name
    });
    m_topic.save();
    res.redirect('/topics/alloftopics');
});

router.get('/alloftopics', ensureAuthenticated, function (req, res, next) {
    Topic.find({}, function (err, topic) {
        if(req.user.type=="instructor"){
            res.render('topic/alloftopics', {'title': 'Topics', 'topics':topic, user: req.user});
        } else {
            res.render('student/alloftopics', {'title': 'Topics', 'topics':topic, user: req.user});
        }
    });
});

router.get('/becarefullwhenyouusethis', ensureAuthenticated, function (req, res, next) {
    Topic.destroy(req, res, next);
});

// ===========Units ===============

router.get('/:id/createunit', ensureAuthenticated, function (req, res, next) {
    Topic.findById(req.params.id, function (err, topic) {
        //res.render('topic/creater', {'title': 'Create topic'});
        res.render('topic/createunit', {'units':topic.unit, 'id':req.params.id} );
    });
});

router.post('/:id/createunit', function (req, res, next) {
    Topic.findById(req.params.id, function (err, topic) {
        if(req.body.type=="1"){
            m_type1=true;m_type2=false;
        } else{
            m_type1=false;m_type2=true;
        }
        topic.unit.push({
            type1: m_type1,
            type2: m_type2,
            number: req.body.number,
            name: req.body.name,
            content: req.body.content,
            answer: req.body.answer,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3,
            answer4: req.body.answer4
        });
        topic.save(function (err) {
            if (err) return handleError(err);
            console.log('Success!');
        });
    });
    res.redirect('/topics/'+req.params.id);
});

router.get('/:id', ensureAuthenticated,function (req, res, next) {
    Topic.findById(req.params.id, function (err, topic) {
        //res.render('topic/creater', {'title': 'Create topic'});
        try{
            if(req.user.type=="instructor"){
                res.render('topic/units', {"topic":topic,"title":topic.name , "units":topic.unit, "id":req.params.id} );
            } else {
                res.render('student/units', {"topic":topic,"title":topic.name , "units":topic.unit, "id":req.params.id} );
            }
        }catch (err){
            throw (err);
        }

    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
