const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Blog } = require("../models/blog");

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id', async(req, res)=> {
  const blog = await Blog.findById(req.params.id);
  return res.render('blog', {
    user: req.user,
    blog
  })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post("/add-new", upload.single("coverImage"),async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title, 
        body, 
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`
    })
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
