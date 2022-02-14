const express = require("express");
const userRouter = express.Router();

const {protectRoute, logoutUser, getUserData, updateUserData, deleteAccount} = require('./userController');

userRouter
    .route('/dashboard')
    .get(protectRoute, getUserData);

userRouter
    .route('/deleteAccount')
    .get(deleteAccount);

userRouter
    .route('/logout')
    .get(logoutUser);

module.exports = userRouter;