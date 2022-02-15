const express = require("express");
const userRouter = express.Router();

const {protectRoute, logoutUser, getUserData, deleteAccount, updateProfile} = require('./userController');

userRouter
    .route('/dashboard')
    .get(protectRoute, getUserData);

userRouter
    .route('/deleteAccount')
    .post(protectRoute, deleteAccount);                                                   // password before deleting account                

userRouter
    .route('/updateProfile')
    .post(protectRoute, updateProfile);

userRouter
    .route('/logout')
    .get(logoutUser);

module.exports = userRouter;