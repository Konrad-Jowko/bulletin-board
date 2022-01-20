const express = require('express');
const router = express.Router();
const passport = require('passport');
const LoginController = require('../controllers/login.controller');

/* ROUTES FOR LOGIN THROUGH GOOGLE */
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/login', LoginController.login);

router.get('/logout', LoginController.logout);

module.exports = router;
