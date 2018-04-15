const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Post = require('./lib/Post')
const waveSurf = require('./lib/fileHandler.js');


const app = express();

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
  console.log("upload request")
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
      console.log("uploading...")
      if(req.file==undefined){
        console.log("Error: No File Selected!'");
        res.render('index',{
          msg: 'Error: No File Selected!'
        });
      }
      else{

        // create post via post Schema
          // to do

          let post = new Post();
          post.post_id = req.file.filename;
          post.filepath = "test";
          post.author = "noobs";
          post.title = "newnew";
          post.date = "1231234";

          post.save(function(err){
            if(err){
              console.log(err);
              return res.status(500).send();
            }
            else{
              console.log('file uploaded');
              return res.status(200).send();
            }
          })


        // res.render('create',{
        //   msg: 'File Uploaded!',
        //   file: `${req.file.filename}`
        // });
      }
    }
  }
);
}
);

// Retrieves the server filepath of a file based on post_id and displays it
app.get('/post',(req,res)=>{
  console.log('generating post');

  let query = Post.findOne({'post_id':'undefined-1523758761020.mp3'});
  query.select('post_id');

  query.exec(function(err,post){
    if(err){
      res.render('index',{
        msg: err
      });
    }
    else{
      console.log(post.post_id);
      res.render('post',{
        file: post.post_id,
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
