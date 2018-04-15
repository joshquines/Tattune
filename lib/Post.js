var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    post_id: String,
    filepath: String,
    author: String,
    title: String,
    date: String
});

var Post = mongoose.model('posts', postSchema);
module.exports = Post;
