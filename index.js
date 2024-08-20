const path = require("path");
const express = require("express");
const { connectDB } = require('./config/connection');
const userRoute = require('./routes/user');
const dotenv =require('dotenv');

const app = express();

const PORT = 8000;

dotenv.config();
connectDB(process.env.mongoUrl);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use('/user', userRoute);


app.get('/', (req, res) => {
    res.render('Home');
});

app.listen(PORT, ()=> {
    console.log(`Server started at port: ${PORT}`);
});