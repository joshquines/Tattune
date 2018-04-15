var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../lib/User');
//var userSchema = new mongoose.Schema({
//    username: {type: String, unique: true},
//    password: {type: String},
//    firstname: String,
//    lastname: String
//});

//var User = mongoose.model('myuser', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            return res.status(404).send();
        }
        req.session.user = user;
        return res.status(200).send();
    })

});

router.get('/dashboard', function(req, res){
    if(!req.session.user){
        //return res.status(401).send();
        return res.redirect('/login');
    }

    return res.status(200).send("Welcome");
})

router.get('/logout', function(req, res){
    req.session.destroy();
    return res.status(200).send();
})

router.post('/register', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;

    newUser.save(function(err, savedUser){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        return res.status(200).send();
    })
})

module.exports = router;
