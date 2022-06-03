const router = require("express").Router();
const fileUploader = require("../middlewares/uploader");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇

const authRoutes = require('./auth.routes')
router.use("/auth", authRoutes)

const postRoutes = require('./post.routes')
router.use("/post", postRoutes)

//Image uploader
// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file)

  if (!req.file) {
    res.json({ errorMessage: "No image found" });
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
