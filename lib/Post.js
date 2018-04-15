var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    post_id: {type: String,unique:true},
    filepath: String,
    author: String,
    title: String,
    date: String
});

var Post = mongoose.model('posts', postSchema);
module.exports = Post;
