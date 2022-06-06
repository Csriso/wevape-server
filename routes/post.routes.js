const router = require("express").Router();
const PostModel = require('../models/Post.model')
const UserModel = require('../models/User.model')
const isAuthenticated = require('../middlewares/isAuthenticated')

// GET "/api/post/" => get all posts
router.get("/", isAuthenticated, async (req, res, next) => {
    console.log(req.payload._id)

    // con esto tienen acceso al usuario logeado
    // esto es el req.session.user._id de M2
    // ! solo tienen acceso si la ruta utiliza el middleware isAuthenticated
    try {
        const response = await PostModel.find().sort([['createdAt', -1]]).populate("user");
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// GET "/api/post/:id" => get single post
router.get("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await PostModel.findById(id).populate("user");
        console.log(response);
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
router.patch("/:id", async (req, res, next) => {

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
router.patch("/:id/manageLikes", async (req, res, next) => {

    const { id } = req.params
    const loggedUserId = req.body.id;
    console.log("POST ID", id, "USERLOGGEDID", loggedUserId);
    try {
        const likedAlready = await PostModel.find({ "_id": id, "likes": loggedUserId });
        console.log("LIKED ALREADY", likedAlready);
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
router.delete("/:id", async (req, res, next) => {
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