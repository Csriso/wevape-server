const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    message: String,
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]

},
    {
        timestamps: true
    }
);

const CommentModel = model("Comment", commentSchema);

module.exports = CommentModel