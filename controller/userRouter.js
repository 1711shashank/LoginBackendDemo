const express = require("express");
const userRouter = express.Router();

const {protectRoute, logoutUser, getUserData} = require('./userController');

userRouter
    .route('/dashboard')
    .get(protectRoute, getUserData);

userRouter
    .route('/logout')
    .get(logoutUser);

module.exports = userRouter;