const path = require("path");
const express = require("express");
const { connectDB } = require('./config/connection');
const cookieParser = require('cookie-parser')
const dotenv =require('dotenv');
const checkAuthCookie = require("./middlewares/authentication");

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const app = express();

const PORT = 8000;

dotenv.config();
connectDB(process.env.mongoUrl);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkAuthCookie("token"));

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', (req, res) => {
    res.render('home', {
        user: req.user
    });
});

app.listen(PORT, ()=> {
    console.log(`Server started at port: ${PORT}`);
});