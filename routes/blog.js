const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { User } = require('../models/user');
const { Blog } = require("../models/blog");
const Comment = require("../models/comment");

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // console.log(blog.createdBy);

    const userId = blog.createdBy; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // console.log(user);

    return res.render('blog', {
      user,
      blog,
      comments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});


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

    if (!title || !body) {
      return res.render('addBlog', {
          
          error: "Add title and body :)"
      });
  }
    const blog = await Blog.create({
        title, 
        body, 
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`
    })
  return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async (req, res) => {
    if(!req.user) return console.log("no user!");
    await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
