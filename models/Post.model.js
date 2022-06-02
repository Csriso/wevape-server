const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    message: String,
    image: String,
    created: String,
    modified: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }
);

const PostModel = model("Post", postSchema);

module.exports = PostModel