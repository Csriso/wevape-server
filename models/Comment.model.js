const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    message: String,
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentCount: Number,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    likeCount: Number,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

},
    {
        timestamps: true
    }
);

const CommentModel = model("Comment", commentSchema);

module.exports = CommentModel