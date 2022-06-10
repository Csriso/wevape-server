const router = require("express").Router();
const PostModel = require('../models/Post.model')
const UserModel = require('../models/User.model')
const isAuthenticated = require('../middlewares/isAuthenticated')

// GET "/api/post/" => get all posts
router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const response = await PostModel.find().sort([['createdAt', -1]]).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// GET "/api/post/:id" => get single post
router.get("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await PostModel.findById(id).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
        res.json(response)
    } catch (error) {
        res.json(error);
        next(error)
    }
})

// GET "/api/post/:id/myfeed" => get my feed
router.get("/:id/myfeed", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        user.following.push(id);
        if (user.following.length !== 0) {
            const response = await PostModel.find().where('user').in(user.following).sort([['createdAt', -1]]).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
            res.json(response);
            return;
        } else {
            res.json({ errorMessage: "User is following anyone." })
        }
    } catch (error) {
        res.json(error);
        next(error)
    }
})

// GET "/api/post/:username/user" => get single post
router.get("/:username/user", isAuthenticated, async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await UserModel.findOne({ username });
        const response = await PostModel.find({ user: user._id }).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
        res.json(response)
    } catch (error) {
        res.json(error);
        next(error)
    }
})

// POST "/api/post" => create new post
router.post("/", isAuthenticated, async (req, res, next) => {
    const { user, newMessage, imageUrl } = req.body
    try {
        const insertData = {
            message: newMessage,
            user: user.id,
            imageUrl,
            likeCount: 0,
        }
        const response = await PostModel.create(insertData);
        res.json(response)

    } catch (error) {
        next(error)
    }
})


// PATCH "/api/post/:id" - edit post
router.patch("/:id", isAuthenticated, async (req, res, next) => {

    const { id } = req.params
    const { message, imageUrl } = req.body

    if (!message === undefined) {
        res.status(400).json("Fill the inputs");
        return;
    }

    try {
        await PostModel.findByIdAndUpdate(id, {
            message,
            imageUrl,
        })

        res.json({ successMessage: "post updated" });
    } catch (error) {
        next(error)
    }
})

// PATCH "/api/post/:id/addLike" - edit post
router.patch("/:id/manageLikes", isAuthenticated, async (req, res, next) => {

    const { id } = req.params
    const loggedUserId = req.body.id;
    try {
        const likedAlready = await PostModel.find({ "_id": id, "likes": loggedUserId });
        if (likedAlready.length === 0) {
            await PostModel.findByIdAndUpdate(id, { $push: { likes: loggedUserId }, $inc: { 'likeCount': 1 } })
        } else {
            await PostModel.findByIdAndUpdate(id, { $pull: { likes: loggedUserId }, $inc: { 'likeCount': -1 } })
        }
        res.json({ successMessage: "post updated" });
    } catch (error) {
        res.json(error)
        next(error)
    }
})

// DELETE "/api/post/:id" - delete post
router.delete("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params

    try {
        await PostModel.findByIdAndDelete(id);
        res.json({ successMessage: "Post deleted." });
        return;
    } catch (error) {
        next(error)
    }

})





module.exports = router;