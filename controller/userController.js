const userDataBase = require('../models/mongoDB');
var jwt = require('jsonwebtoken');
const JWT_KEY = 'skf453wdanj3rfj93nos';


module.exports.protectRoute = function protectRoute(req,res,next){
    // checking wether user is logged In or not using cookies (JWT encrypted cookies)
    try{

        // if isVerified token is Invalide then it will give an error and to the catch block 
        // and if it is true then isVerified will contain some payload value and pass the is statement 
            // we can also skip the if() conduction and directly write the statement inside it

        // req.cookies.isLoggedIn this hashValue contain payload (_id), so while verifying [_id] is not required
        let isVerified = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);
        console.log(isVerified.payload);
        if( isVerified ){
            next();
        }
    }
    catch{
        res.json({
            message: 'Please Login '
        })
    }
}

module.exports.logoutUser = function logoutUser(req,res){
    let dataObj = req.body;
    console.log(req.body);

    res.cookie('isLoggedIn', 'false');
    res.json({
        message:"User LogOut Successfully",
        data:dataObj 
    })
}

module.exports.getUserData = async function getUserData(req,res){
     
    let dataObj = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);

    let userData = await userDataBase.findOne({ _id : dataObj.payload });

    res.json({
        message:"In the dashborad",
        res: userData
    })
}
