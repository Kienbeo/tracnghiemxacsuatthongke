var express = require('express');
var router = express.Router();

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/signup', function (req, res, next) {
    res.render('user/signup', {'title': 'Sign up', message: req.flash('message')})
});

router.post('/signup', function (req, res, next) {
    var m_user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        type: req.body.type
    });
    if(req.body.type=="student"){
        var m_student = new Student({
            name: req.body.name,
            user_id: m_user._id,
            type: 'student'
        });
        m_user.save();
        m_student.save();
    }
    if(req.body.type=='instructor'){
        var m_instructor = new Instructor({
            name: req.body.name,
            user_id: m_user._id,
            type: 'instructor'
        });
        m_user.save();
        m_instructor.save();
    }
    //m_user.save(function (err) {
    //    if(err){
    //        throw(err);
     //   }
    //});
    res.redirect('/users/allofusers');
});

router.get('/allofusers', ensureAuthenticated, function (req, res, next) {
    User.find({}, function (err, user) {
        res.json(user);
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', {'title': 'Log in'})
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/topics/alloftopics',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');
    req.session.notice = "You have successfully been logged out ";
    res.redirect('/');
});

router.get('/becarefullwhenyouusethis', function (req, res, next) {
    User.destroy(req, res, next);
});

// ======Passport ============
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
                //return done(null, false, req.flash('message', 'User Not found.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.'});
                //return done(null, false, req.flash('message', 'Invalid Password'));
            }
            return done(null, user);
        });
    }
));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
