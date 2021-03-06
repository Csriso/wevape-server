const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    message: String,
    imageUrl: String,
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
    deleted: {
        type: Boolean,
        default: false,
    }

},
    {
        timestamps: true
    }
);

const CommentModel = model("Comment", commentSchema);

module.exports = CommentModel