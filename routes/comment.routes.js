const router = require("express").Router();
const CommentModel = require('../models/Comment.model')
const PostModel = require('../models/Post.model')


// GET ONE COMMENT
router.get("/:id", (req, res, next) => {

})

// CREATE NEW COMMENT 
// "/api/comment/:idPost"
router.post("/:idPost", async (req, res, next) => {
    const { idPost } = req.params;
    const { user, newMessage, imageUrl } = req.body;
    try {
        console.log(idPost, req.body);
        const insertData = {
            message: newMessage,
            user: user,
            imageUrl,
            likeCount: 0,
            commentCount: 0,
        }
        const responseComment = await CommentModel.create(insertData);
        console.log(responseComment);
        const insertCommentOnPost = await PostModel.findByIdAndUpdate(idPost, { $push: { comments: responseComment._id }, $inc: { 'commentCount': 1 } })
        console.log(insertCommentOnPost);

    } catch (error) {
        console.log(error);
    }
})

module.exports = router