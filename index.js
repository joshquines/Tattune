const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Post = require('./lib/Post')
const waveSurf = require('./lib/fileHandler.js');
const moment = require('moment');
let session = require('express-session');

// req.session.user = "alvin";



const app = express();

app.use(session({secret:"9aduoshbj1082hd8dowhualj", resave:false, saveUninitialized:true}));

// app.use(bodyParser());

mongoose.connect('mongodb://localhost/test', function(err){
	if(err){
		return console.log(err)
	}
	return console.log("Successfully connected to MongoDB!");
});

// Set Storage engine
let storage = multer.diskStorage({
  destination: './public/',
  filename: function(reg,file,cb){
    cb(null,file.myImage+'-'+Date.now()+path.extname(file.originalname));
  }
});

// parser for uploads via Multer
let upload = multer({
  storage: storage,
  fileFilter:function(req,file,cb){
    checkFileType(file,cb);
  }
}).single('myAudio');



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
      next();
  }
}

// FileHandler Upload / Wave Generator
function waveGenerator(){
  let wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'green',
    progressColor: 'purple',
    responsive: 'false',
    barWidth: '1',
    scrollParent: 'true'
  });
  
}

app.set('view engine', 'ejs');
app.use(express.static('public'));


// loads login page
app.post('/login',authenticateCredentials(),function(req,res){
  // res.render('home');
});

// Renders the main page if user is logged in.
app.get('/',checkIfLoggedIn(),(req,res)=>res.render('fileHandlerTest'));


// Upload a file to server and registers it as a post in DB
app.post('/upload',(req,res)=>{

  // create post via post Schema
  upload(req,res,(err)=>{
    console.log(req.file.filename);
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
        // res.render('create',{
        //   msg: 'File Uploaded!',
        //   file: `${req.file.filename}`
        // });

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

app.get('/comment',(req,res)=>{

});

// Retrieves the server filepath of a file based on post_id and displays it
app.get('/post/:post_id',(req,res)=>{
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
        filetype: 'mp3'
      });
    }
  });
});



// Displays all posts uploaded
app.get('/discover',function(req,res){
  let query = Post.find();
  query.select('post_id');

  query.exec(function(err,posts){
    if(err){
      res.render('index',{
        msg: err
      });
    }
    else{
      console.log(posts);

      res.render('discover',{
        posts: posts,
        filetype: 'mp3'
      });
    }
  });
});

//Start the server
app.listen(1337);
