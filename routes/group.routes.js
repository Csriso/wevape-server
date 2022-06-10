const router = require("express").Router();
const GroupModel = require('../models/Group.model')
const UserModel = require('../models/User.model')
const isAuthenticated = require('../middlewares/isAuthenticated')

// GET "/api/group/" => get all groups
router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const response = await GroupModel.find().sort([['createdAt', -1]]);
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// GET "/api/group/" => get all groups
router.get("/my", isAuthenticated, async (req, res, next) => {
    const { id } = req.body;
    try {
        const response = await UserModel.findById(req.payload.id).populate("groups");
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// GET "/api/group/:id" => get single group
router.get("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await GroupModel.findById(id);
        res.json(response)
    } catch (error) {
        res.json(error);
        next(error)
    }
})


// POST "/api/group" => create new group
router.post("/", isAuthenticated, async (req, res, next) => {
    const { name, description, imageUrl } = req.body
    try {
        const insertData = {
            name,
            description,
            imageUrl,
            owner: req.payload.id
        }
        const response = await GroupModel.create(insertData);
        res.json(response)

    } catch (error) {
        next(error)
    }
})

// POST "/api/group/:id/join" => join to a group
router.post("/:id/join", isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const { _id: userId } = req.body;
    try {
        const findGroups = await UserModel.findById(userId);
        let response;
        if (!findGroups.groups.includes(id)) {
            response = await UserModel.findByIdAndUpdate(userId, { $addToSet: { groups: id } });
        } else {
            response = await UserModel.findByIdAndUpdate(userId, { $pull: { groups: id } });
        }
        res.json(response)

    } catch (error) {
        next(error)
    }
})


// PATCH "/api/group/:id" - edit group
router.patch("/:id", isAuthenticated, async (req, res, next) => {

    const { id } = req.params
    const { message, imageUrl } = req.body

    if (!message === undefined) {
        res.status(400).json("Fill the inputs");
        return;
    }

    try {
        await GroupModel.findByIdAndUpdate(id, {
            message,
            imageUrl,
        })

        res.json({ successMessage: "post updated" });
    } catch (error) {
        next(error)
    }
})

// DELETE "/api/group/:id" - delete group
router.delete("/:id", isAuthenticated, async (req, res, next) => {
    const { id } = req.params

    try {
        await GroupModel.findByIdAndDelete(id);
        res.json({ successMessage: "Post deleted." });
        return;
    } catch (error) {
        next(error)
    }

})





module.exports = router;