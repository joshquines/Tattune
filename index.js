const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;


const app = express();
let Schema = mongoose.Schema;

// Set Storage engine
let storage = multer.diskStorage({
  destination: './public/',
  filename: function(reg,file,cb){
    cb(null,file.myImage+'-'+Date.now()+path.extname(file.originalname));
  }
});

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

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/',checkIfLoggedIn(res), (req,res)=>res.render('index'));


// Check if user is logged in
function checkIfLoggedIn(res)){

  // if logged in
  //   return next();
  // else
    // res.render.('login');
}

// Authenicate the user and password to match a DB entry
function authenticateCredentials(req,res){
  //
}

app.post('/login',authenticateCredentials(req,res),function(req,res){
  // res.render('home');
});



app.post('/upload',(req,res)=>{
  upload(req,res,(err)=>{
    if(err){
      res.render('index',{
        msg: err
      });
    }else{
      if(req.file==undefined){
        res.render('index',{
          msg: 'Error: No File Selected!'
        });
      }
      else{

        // create post via post Schema
          // to do

        res.render('create',{
          msg: 'File Uploaded!',
          file: `${req.file.filename}`
        });
      }
    }
  }
);
}
);





//Start the server
app.listen(1337);

mongoose.connect('mongodb://localhost:27017/test');
let c = mongoose.connection;

  let fileSchema = new Schema({
    filepath: String
  });
