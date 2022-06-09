const router = require("express").Router();
const UserModel = require('../models/User.model')
const AdModel = require('../models/Ad.model')
const isAuthenticated = require('../middlewares/isAuthenticated')

// GET "/api/ad/" => get all ads
router.get("/", isAuthenticated, async (req, res, next) => {
    console.log("ENTRO");
    try {
        const response = await AdModel.find().sort([['createdAt', -1]]).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// GET "/api/ad/:id" => get single ad
router.get("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await AdModel.findById(id).populate({ path: 'user', select: 'username imageUrl' }).populate("comments");
        res.json(response)
    } catch (error) {
        res.json(error);
        next(error)
    }
})

// POST "/api/ad" => create new ad
router.post("/", isAuthenticated, async (req, res, next) => {
    const { user, newMessage, imageUrl, price } = req.body
    try {
        const insertData = {
            message: newMessage,
            user: user.id,
            imageUrl,
            likeCount: 0,
            price
        }
        const response = await AdModel.create(insertData);
        res.json(response)

    } catch (error) {
        next(error)
    }
})

// PATCH "/api/ad/:id" - edit post
router.patch("/:id", isAuthenticated, async (req, res, next) => {

    const { id } = req.params
    const { message, imageUrl } = req.body

    if (!message === undefined) {
        res.status(400).json("Fill the inputs");
        return;
    }

    try {
        await AdModel.findByIdAndUpdate(id, {
            message,
            imageUrl,
        })

        res.json({ successMessage: "post updated" });
    } catch (error) {
        next(error)
    }
})

// PATCH "/api/ad/:id/addLike" - edit post
router.patch("/:id/manageLikes", isAuthenticated, async (req, res, next) => {

    const { id } = req.params
    const loggedUserId = req.body.id;
    try {
        const likedAlready = await AdModel.find({ "_id": id, "likes": loggedUserId });
        if (likedAlready.length === 0) {
            await AdModel.findByIdAndUpdate(id, { $push: { likes: loggedUserId }, $inc: { 'likeCount': 1 } })
        } else {
            await AdModel.findByIdAndUpdate(id, { $pull: { likes: loggedUserId }, $inc: { 'likeCount': -1 } })
        }
        res.json({ successMessage: "post updated" });
    } catch (error) {
        res.json(error)
        next(error)
    }
})

// DELETE "/api/ad/:id" - delete post
router.delete("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params

    try {
        await AdModel.findByIdAndDelete(id);
        res.json({ successMessage: "Post deleted." });
        return;
    } catch (error) {
        next(error)
    }
})





module.exports = router;