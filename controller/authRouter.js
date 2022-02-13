const express = require("express");
const authRouter = express.Router();

const { createAccount, loginUser } = require('./authController');

authRouter
    .route('/signup')
    .post(createAccount);
authRouter
    .route('/login')
    .post(loginUser);

module.exports = authRouter;