const { Schema, model } = require('mongoose')

const adSchema = new Schema({
    product: String,
    message: String,
    imageUrl: String,
    sold: Boolean,
    reserved: Boolean,
    reservedId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    soldId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    likeCount: Number,
    price: Number,
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

const AdModel = model("Ad", adSchema);

module.exports = AdModel