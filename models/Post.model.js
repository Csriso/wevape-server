const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    message: String,
    imageUrl: String,
    likeCount: Number,
    likes: [{
        type: Schema.Types.ObjectId, ref: 'User', unique: true,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true
    }
);

const PostModel = model("Post", postSchema);

module.exports = PostModel