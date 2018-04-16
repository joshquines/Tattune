// var express = require('express');

var mongoose = require('mongoose');
var User = require('../lib/User');

const express = require('express');

var router = express.Router();

const ejs = require('ejs');var path = require('path');
// const bodyParser = require('body-parser');
const multer = require('multer');
// const path = require('path');
// const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Post = require('../lib/Post')
const Comment = require('../lib/Comment')
// const waveSurf = require('../lib/fileHandler.js');
// const moment = require('moment');


/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

// Retrieve Log In Page
router.get('/login', function(req,res){
  res.render('login');
})


// Submit Login Credentials
router.post('/login', function(req, res){
    console.log(req);
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);

    User.findOne({username: username, password: password}, function(err, user){

        if(err){
            console.log(err);
            return res.status(500).send();
        }
        else if(user==null){
            // return res.status(404).send();
            return res.render('login');
        }else{

        req.session.user = user;
        return res.render('index');
      }
    });

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

// Retrieve registration page
router.get('/register', function(req, res){
  res.render('signup');
});


// Submit registration request
router.post('/register', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);

    var newUser = new User();
    newUser.username = username;
    newUser.password = password;

    newUser.save(function(err, savedUser){
        if(err){
            console.log(err);
            // return res.status(500).send();
        }
        return res.render('login');
    })
})


// Alvin's stuff below--------

// Set Storage engine
let storage = multer.diskStorage({
  destination: './public/',
  filename: function(reg,file,cb){
    cb(null,file.myImage+'-'+Date.now()+'.png');
  }
});

// parser for uploads via Multer
const upload = multer({
  storage: storage,
  // fileFilter:function(req,file,cb){
  //   checkFileType(file,cb);
  // }
// }).single('myWave');

}).single('myWave');



// Check File type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /wav||mp3||aac||gif/;
  // Check extn
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(extname&&extname){
    return cb(null,true);
  }
  else{
    cb('Error: Images Only!');
  }
}


// Authenicate the user and password to match a DB entry
function authenticateCredentials(req,res){
  return function(req,res,next){
      next();
  }
}

// Check if user is logged in
function checkIfLoggedIn(){
  return function(req,res,next){
      // console.log(req.session.user);
      // if(req.session.user!=undefined){
      //     next();
      // }
      // else{
      //   console.log("NOT LOGGED IN!!");
      //   res.render('index0');
      // }

      next();
  }
}

// loads login page
// router.post('/login',authenticateCredentials(),function(req,res){
//   // res.render('home');
// });

// Renders the main page if user is logged in.
router.get('/',checkIfLoggedIn(),(req,res)=>res.render('index'));


// Upload a file to server and registers it as a post in DB
router.post('/upload',(req,res)=>{
	console.log("upload request");
  // create post via post Schema
  upload(req,res,(err)=>{
    // console.log(req.file.filename);
    console.log(req.file);
    if(err){
      console.log("failed")
      res.render('index',{
        msg: err
      });
    }
    else
    {
      if(req.file==undefined){
        console.log("Error: No File Selected!'");
        res.render('index',{
          msg: 'Error: No File Selected!'
        });
      }
      else{
        res.render('index',{
          msg: 'File Uploaded!',
          // file: `${req.file.filename}`
        });

        let post = new Post();
        let title = req.title;

          post.filepath = req.file.filename;
          post.post_id = req.file.filename;
          // post.author = req.session.user.username;
          post.title = req.body.title;
          post.date = Date.now();

          post.save(function(err){
            if(err){
              console.log("FAILED");
              console.log(err);
              return res.status(500).send();
            }
            else{
              console.log("sent to db");
              console.log(post);
              return res.status(200).send();
            }
          });

      }
    }
  }
);




});


// Retrieves the server filepath of a file based on post_id and displays it
router.get('/post/:post_id',(req,res)=>{
  console.log('generating post');

  let query = Post.findOne({'post_id':req.params.post_id});
  query.select('post_id filename title date');

  query.exec(function(err,post){
    if(err){
      res.render('index',{
        msg: err
      });
    }
    else{
      console.log(post.post_id);

      res.render('post',{
        file: post,
        filetype: 'mp3',
        // comments: comments;
      });
    }
  });


});


// Post Comment
// Add a comment to an existing post.
router.post('/comment',(req,res)=>{
  let comment = new Comment();

  let link = req.headers.referer;
  let parsed = link.split('/');
  let id = parsed[parsed.length-1];
  comment.post_id = id;
  console.log(id);
  comment.comment = req.body.comment;
  // comment.author = req.session.user.username;
  // comment.post_id = req;
  comment.date = Date.now();

  comment.save(function(err){
    if(err){
      console.log("FAILED");
      console.log(err);
      // return res.status(500).send();
    }
    else{
      console.log("sent to db");
      // console.log(post);
      // res.status(200).send({
      //   comment: comment
      // });
      // console.log(req);
      // res.redirect('/post/undefined-1523845557148.png',{
      //   comment: comment
      // });

      let link = req.headers.referer;

      res.redirect(link);

    }
  });
});




// Displays all posts uploaded
router.get('/discover',function(req,res){
  let query = Post.find();
  query.select('post_id');

  query.exec(function(err,posts){
    if(err){
      res.render('index',{
        msg: err
      });
    }
    else{
      // console.log(posts);

      res.render('discover',{
        posts: posts,
        filetype: 'png'
      });
    }
  });
});

module.exports = router;
