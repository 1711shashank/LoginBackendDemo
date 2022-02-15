const userDataBase = require('../models/mongoDB');
var jwt = require('jsonwebtoken');
const userRouter = require('./userRouter');
const { use } = require('./authRouter');
const JWT_KEY = 'skf453wdanj3rfj93nos';


module.exports.protectRoute = function protectRoute(req, res, next) {
    // checking wether user is logged In or not using cookies (JWT encrypted cookies)
    try {

        // if isVerified token is Invalide then it will give an error and to the catch block 
        // and if it is true then isVerified will contain some payload value and pass the is statement 
        // we can also skip the if() conduction and directly write the statement inside it

        // req.cookies.isLoggedIn this hashValue contain payload (_id), so while verifying [_id] is not required
        let isVerified = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);
        if (isVerified) {
            next();
        }
    }
    catch {
        res.json({
            message: 'Please Login '
        })
    }
}

module.exports.logoutUser = function logoutUser(req, res) {

    res.cookie('isLoggedIn', 'false', { maxAge: 1 });
    res.json({
        message: "User LogOut Successfully",
    })
}

module.exports.getUserData = async function getUserData(req, res) {

    let dataObj = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);

    let userData = await userDataBase.findOne({ _id: dataObj.payload });

    res.json({
        message: "In the dashborad",
        res: userData
    })
}

module.exports.deleteAccount = async function deleteAccount(req, res) {


    let user_ID = jwt.verify(req.cookies.isLoggedIn, JWT_KEY).payload;
    let user = await userDataBase.findByIdAndDelete(user_ID);

    console.log("Account has been Deleted");

    res.cookie('isLoggedIn', 'false', { maxAge: 1000 });

    res.json({
        message: "Account has been Deleted",
        res: user
    })
}

module.exports.updateProfile = async function updateProfile(req, res) {

    try {
        let user_ID = jwt.verify(req.cookies.isLoggedIn, JWT_KEY).payload;
        let userData = await userDataBase.findById(user_ID);

        let dataToBeUpdated = req.body;

        const keys = [];
        for (let key in dataToBeUpdated) {
            keys.push(key);
        }

        for (let i = 0; i < keys.length; i++) {
            userData[keys[i]] = dataToBeUpdated[keys[i]];
        }

        await userData.save();         // update the data to mongoDB

        console.log("Data Updated successfully");
        res.json({
            message: "Data Updated successfully",
            data: userData
        })

    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

