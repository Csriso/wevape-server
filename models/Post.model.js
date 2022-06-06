const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    message: String,
    imageUrl: String,
    likeCount: Number,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentCount: Number,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
},
    {
        timestamps: true
    }
);

const PostModel = model("Post", postSchema);

module.exports = PostModel