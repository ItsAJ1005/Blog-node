const path = require("path");
const express = require("express");
const { connectDB } = require('./config/connection');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const checkAuthCookie = require("./middlewares/authentication");
// const helmet = require('helmet');
// const cors = require('cors');
// const morgan = require('morgan');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { Blog } = require("./models/blog");

const app = express();

const PORT = process.env.PORT || 8000; // Use environment variable if defined

dotenv.config();
connectDB(process.env.mongoUrl);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthCookie("token"));
app.use(express.static(path.resolve("./public")));

// Security and logging middleware
// app.use(helmet());
// app.use(cors());
// app.use(morgan('combined'));

// Routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        if (!allBlogs || allBlogs.length === 0) {
            return res.render('home', {
                user: req.user,
                blogs: allBlogs,
                message: "No blogs available. Please sign in and add blogs :)"
            });
        }
        res.render('home', {
            user: req.user,
            blogs: allBlogs
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
