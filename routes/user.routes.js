const isAuthenticated = require('../middlewares/isAuthenticated.js');
const UserModel = require('../models/User.model.js')
const router = require("express").Router();


// GET "/api/user/:username" => get user info
router.get("/:username", isAuthenticated, async (req, res, next) => {
    const { username } = req.params;
    if (username === undefined) {
        res.json({ errorMessage: "Username undefined" });
        return;
    }
    try {
        const response = await UserModel.find({ username: username });
        if (response.length === 0) {
            res.json({ errorMessage: "User not found." });
            return;
        }
        res.json(response[0]);
    } catch (error) {
        next(error)
    }
})

//PATCH "/api/user/:username" => edit user
router.patch("/:username", isAuthenticated, async (req, res, next) => {
    const { username } = req.params;

    if (username === undefined) {
        res.json({ errorMessage: "Username undefined" });
        return;
    }

    try {
        const response = await UserModel.findOneAndUpdate({ username: username }, req.body);
        if (response.length === 0 || response === null) {
            res.json({ errorMessage: "We cant update user." });
            return;
        }
        res.json({ sucessMessage: "User updated" });
    } catch (error) {
        if (error.codeName === "DuplicateKey") {
            res.json({ errorMessage: "We cant update user, username already in use." });
            return;
        }
        next(error)
    }
})

//PATCH "/api/user/:username/follow" => edit user
router.patch("/:username/follow", isAuthenticated, async (req, res, next) => {
    const { username } = req.params;
    const userFollowingReq = req.body;
    if (username === undefined) {
        res.json({ errorMessage: "Username undefined" });
        return;
    }
    try {
        const userFollowing = await UserModel.findOne({ username: userFollowingReq.username });
        const userFollowed = await UserModel.findOne({ username: username });

        if (!userFollowing.following.includes(userFollowed._id)) {
            //FOLLOW
            await UserModel.findByIdAndUpdate(userFollowing._id, { $push: { following: userFollowed._id } })
        } else {
            //UNFOLLOW
            await UserModel.findByIdAndUpdate(userFollowing._id, { $pull: { following: userFollowed._id } })
        }
        res.json({ sucessMessage: "User updated" });
    } catch (error) {
        if (error.codeName === "DuplicateKey") {
            res.json({ errorMessage: "We cant update user, username already in use." });
            return;
        }
        next(error)
    }
})

//DELETE "/api/user/:username" => delete account
router.delete("/:username", isAuthenticated, async (req, res, next) => {
    const { username } = req.params;
    if (username === undefined) {
        res.json({ errorMessage: "Username undefined" });
        return;
    }

    try {
        const response = await UserModel.findOneAndDelete({ username: username });
        res.json(response);
    } catch (error) {
        next(error)
    }
})


module.exports = router;