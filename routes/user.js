const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async(req, res) => {
    const { fullName, email, password } = req.body;

    await User.create({
        fullName,
        email, 
        password
    });

    return res.redirect('/');
});

router.post('/signin', async(req, res)=>{
    const { email, password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);

        console.log("Token: ", token);
        return res.cookie('token', token).redirect('/');
    } catch(error){
        return res.render('login', {
            error: "Incorrect password"
        });
    }

})

module.exports = router;
