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
        console.log(`ENTROOOOOoooooooooOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`);
        console.log(username);
        const response = await UserModel.find({ username: username });

        console.log(response);
        if (response.length === 0) {
            res.json({ errorMessage: "User not found." });
            return;
        }
        res.json(response[0]);
    } catch (error) {
        next(error)
    }
})

// GET "/api/user/:id/id" => get user info by id
router.get("/:id/id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    if (id === undefined) {
        res.json({ errorMessage: "Username undefined" });
        return;
    }
    try {
        const response = await UserModel.findById(id).select("-password");
        if (response.length === 0) {
            res.json({ errorMessage: "User not found." });
            return;
        }
        res.json(response);
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
        console.log(username, userFollowingReq);
        const userFollowing = await UserModel.findById(userFollowingReq.id);
        const userFollowed = await UserModel.findOne({ username: username });
        console.log(userFollowing, userFollowed);
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

//PATCH "/api/user/:username/image" => edit avatar image
router.patch("/:userid/image", isAuthenticated, async (req, res, next) => {
    const { userid } = req.params;
    const { imageUrl } = req.body;
    console.log("IMAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    if (userid === undefined) {
        res.json({ errorMessage: "userid undefined" });
        return;
    }
    console.log(userid, imageUrl);
    try {
        const response = await UserModel.findByIdAndUpdate(userid, { imageUrl: imageUrl });
        console.log(response);
        res.json({ sucessMessage: "User updated" });
    } catch (error) {
        console.log(error);
        res.json({ errorMessage: error });
        return;
    }
})

//PATCH "/api/user/edit" Edit register
router.patch("/:id/edit", async (req, res, next) => {
    const { id } = req.params
    const { password, repeatPassword, username, location, description } = req.body;
    // Checking all inputs

    if ((password && !repeatPassword) || (!password && repeatPassword)) {
        res.status(400).json({ errorMessage: "Fill all the inputs." });
        return;
    }
    // Password.length >= 8 
    if (password && repeatPassword) {
        if (password.length < 8 || repeatPassword < 8) {
            res.status(400).json({ errorMessage: "Passwords need to have more than 8 characters." });
            return;
        }
        // Passwords match
        if (password !== repeatPassword) {
            res.status(400).json({ errorMessage: "Passwords dosent match." });
            return;
        }
        // Regex for password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (passwordRegex.test(password) === false) {
            res.status(400).json({ errorMessage: "Invalid password, need 8 characters, one letter and one number." });
            return;
        }
    }


    try {

        // Hash password
        let response;
        if (password && repeatPassword) {
            const salt = await bcryptjs.genSalt(10);
            const hashPassword = await bcryptjs.hash(password, salt);
            // Create User
            response = await UserModel.findByIdAndUpdate(id, {
                username: username.trim(),
                email,
                location,
                description,
                password: hashPassword,
            }, { new: true })

        } else {
            response = await UserModel.findByIdAndUpdate(id, {
                username: username.trim(),
                location,
                description,
            }, { new: true })
        }
        res.json(response);
    } catch (error) {
        next(error)
    }
})



module.exports = router;