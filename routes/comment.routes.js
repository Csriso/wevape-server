const router = require("express").Router();
const CommentModel = require('../models/Comment.model')
const PostModel = require('../models/Post.model')


// GET ONE COMMENT
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        //{ path: 'fans', select: 'name' }
        const response = await CommentModel.findById(id).populate("user").populate("comments");
        res.json(response);
    } catch (error) {
        res.json(error);
    }
})

// CREATE NEW COMMENT 
// POST "/api/comment/:id/comment"
router.post("/of/comment/:id/", async (req, res, next) => {
    const { id } = req.params;
    const { user, newMessage, imageUrl } = req.body;
    try {
        const insertData = {
            message: newMessage,
            user: user,
            imageUrl,
            likeCount: 0,
            commentCount: 0,
        }
        const responseComment = await CommentModel.create(insertData);
        const insertCommentOnComment = await CommentModel.findByIdAndUpdate(id, { $push: { comments: responseComment._id }, $inc: { 'commentCount': 1 } })
        res.json("comment of comment added");
    } catch (error) {
        res.json(error);
    }
})
// CREATE NEW COMMENT 
// POST "/api/comment/:idPost"
router.post("/:idPost", async (req, res, next) => {
    const { idPost } = req.params;
    const { user, newMessage, imageUrl } = req.body;
    try {
        const insertData = {
            message: newMessage,
            user: user,
            imageUrl,
            likeCount: 0,
            commentCount: 0,
        }
        const responseComment = await CommentModel.create(insertData);
        const insertCommentOnPost = await PostModel.findByIdAndUpdate(idPost, { $push: { comments: responseComment._id }, $inc: { 'commentCount': 1 } })
        res.json("comment added");
    } catch (error) {
        res.json(error);
    }
})


// PATCH "/api/post/:id/addLike" - manage likes dislike post
router.patch("/:id/manageLikes", async (req, res, next) => {

    const { id } = req.params
    const loggedUserId = req.body.id;
    try {
        const likedAlready = await CommentModel.find({ "_id": id, "likes": loggedUserId });
        if (likedAlready.length === 0) {
            await CommentModel.findByIdAndUpdate(id, { $push: { likes: loggedUserId }, $inc: { 'likeCount': 1 } })
        } else {
            await CommentModel.findByIdAndUpdate(id, { $pull: { likes: loggedUserId }, $inc: { 'likeCount': -1 } })
        }
        res.json({ successMessage: "post updated" });
    } catch (error) {
        res.json(error)
    }
})

module.exports = router