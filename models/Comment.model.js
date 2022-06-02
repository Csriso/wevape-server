const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
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

const CommentModel = model("Comment", commentSchema);

module.exports = CommentModel