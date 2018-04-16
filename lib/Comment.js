var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    comment_id: String,
    comment: String,
    author: String,
    post_id: String,
    time: Date
});

var Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
