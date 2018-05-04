const express = require("express");
const router = express.Router();
const passport = require('passport');
const path = require("path");

// auth login
router.get('/login', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, "src/components/auth/login.js"));
});

//auth logout
router.get('/logout', (req, res) => {
    //handle with passport
    req.logout();
    res.redirect('/');
});

//auth google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

module.exports = router;