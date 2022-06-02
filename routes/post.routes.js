const router = require("express").Router();
const UserModel = require('../models/User.model.js')
const PostModel = require('../models/user.model.js')
const jwt = require("jsonwebtoken")
const isAuthenticated = require('../middlewares/isAuthenticated')

// GET "/api/posts/" => get all posts
router.get("/", isAuthenticated, async (req, res, next) => {
    console.log(req.payload._id)
    // con esto tienen acceso al usuario logeado
    // esto es el req.session.user._id de M2
    // ! solo tienen acceso si la ruta utiliza el middleware isAuthenticated
    try {
        const response = await PostModel.find().select("title")
        // ... cualquier codigo
        res.json(response)
    } catch (error) {
        next(error)
    }
})

// POST "/api/todos" => crear un nuevo To-do
router.post("/", async (req, res, next) => {

    const { title, description, isUrgent } = req.body

    try {

        const response = await TodoModel.create({
            title,
            description,
            isUrgent
        })
        res.json(response)

    } catch (error) {
        next(error)
    }

})

// GET "/api/todos/:id" => ver los detalles de un to-do
router.get("/:id", async (req, res, next) => {

    const { id } = req.params

    try {

        const response = await TodoModel.findById(id)
        res.json(response)

    } catch (error) {
        next(error)
    }

})

// DELETE "/api/todos/:id" => borrar un to-do
router.delete("/:id", async (req, res, next) => {

    const { id } = req.params

    try {

        // buscar un todo y borrarlo de la BD
        await TodoModel.findByIdAndDelete(id)
        res.json("to-do ha sido borrado") // no importa lo que enviemos, siempre hay que dar una respuesta

    } catch (error) {
        next(error)
    }

})

// PATCH "/api/todos/:id" => editar un To-Do
router.patch("/:id", async (req, res, next) => {

    const { id } = req.params
    const { title, description, isUrgent } = req.body

    if (!title || !description || isUrgent === undefined) {
        res.status(400).json("todos los campos deben estar llenos")
    }

    // const todoObj = { }

    // if (title) {
    //   todoObj.title = title
    // }

    // if (description) {
    //   todoObj.description = description
    // }

    // if (isUrgent) {
    //   todoObj.isUrgent = isUrgent
    // }

    try {

        await TodoModel.findByIdAndUpdate(id, {
            title,
            description,
            isUrgent
        })
        res.json("to-do actualizado")

        // // esto es si el frontend requiere el elemento actualizado justo luego de hacer el edit
        // const response = await TodoModel.findByIdAndUpdate(id, {
        //   title,
        //   description,
        //   isUrgent
        // }, {new: true})
        // res.json(response)

    } catch (error) {
        next(error)
    }

})



module.exports = router;