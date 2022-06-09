const { Schema, model } = require('mongoose')

const groupSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true
    }
);

const GroupModel = model("Group", groupSchema);

module.exports = GroupModel