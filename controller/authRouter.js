const express = require("express");
const { cookie } = require("express/lib/response");
const authRouter = express.Router();

const { createAccount, loginUser, forgetPassword, resetPassword } = require('./authController');

authRouter
    .route('/signup')
    .post(createAccount);
authRouter
    .route('/login')
    .post(loginUser);
authRouter
    .route('/forgetPassword')
    .post(forgetPassword);
authRouter
    .route('/resetPassword/:hashToken')
    .post(resetPassword);

module.exports = authRouter;