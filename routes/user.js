const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.render('signup', {
            error: "All fields are required."
        });
    }

    if (!email.includes('@')) {
        return res.render('signup', {
            error: "Invalid email address. It must contain '@'."
        });
    }

    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', {
                error: "Email is already in use. Forgot password feature coming soon..."
            });
        }

        await User.create({
            fullName,
            email, 
            password 
        });

        return res.redirect('/'); 
    } catch (error) {
        console.error("Error during signup:", error);
        return res.render('signup', {
            error: "An error occurred during signup. Please try again."
        });
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !email.includes('@')) {
        return res.render('signin', {
            error: "Invalid email address. Enter a valid email address'."
        });
    }

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // Set the token as a cookie and redirect to the home page
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        return res.render('signin', {
            error: "Incorrect email or password."
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

module.exports = router;
