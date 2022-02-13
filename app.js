const express = require("express");
const userDataBase = require('./mongoDB');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_KEY = 'skf453wdanj3rfj93nos';

var cookieParser = require('cookie-parser');

const app = express();
app.use(express.json(),cookieParser());
app.listen(3000);

const authRouter = express.Router();
app.use('/', authRouter)

authRouter
    .route('/signup')
    .post(createAccount);
authRouter
    .route('/login')
    .post(loginUser);
authRouter
    .route('/logout')
    .get(logoutUser);


const userRouter = express.Router();
app.use('/', userRouter)
    
userRouter
    .route('/dashboard')
    .get(protectRoute, getUserData);


async function createAccount(req, res) {
    let dataObj = req.body;
    let user = await userDataBase.create(dataObj);
    res.json({
        message: "Account created Successfully",
        data: user
    });
}

async function loginUser(req, res) {
    try {
        let dataObj = req.body;
        res.cookie('isLoggedIn', 'false');
        if (dataObj.email && dataObj.password) {
            let user = await userDataBase.findOne({ email: dataObj.email });
            if (user) {
                let isVaildPassword = await bcrypt.compare(dataObj.password, user.password);
                if (isVaildPassword) {
                    let uid = user['_id'];
                    let jwtSign = jwt.sign({payload:uid},JWT_KEY);
                    console.log(jwtSign);
                    res.cookie('isLoggedIn', jwtSign);
                    res.json({
                        message: "LogIn Successfully",
                        data: user
                    });
                }
                else {
                    res.json({
                        message: "Invalid Password",
                    });
                }
            } else {
                res.json({
                    message: "User does not exist",
                });
            }
        }
        else {
            return res.json({
                message: 'Wrong credantials'
            })

        }
    }
    catch (err) {
        console.log(err);
    }
}

function getUserData(req,res){
    let userData = req.body;
    res.json({
        message:"In the dashborad",
        res:userData
    })
}

function logoutUser(req,res){
    res.cookie('isLoggedIn', 'false');
    res.json({
        message:"User LogOut Successfully"
    })
}

function protectRoute(req,res,next){
    // checking wether user is logged In or not using cookies (JWT encrypted cookies)
    try{

        // if isVerified token is Invalide then it will give an error and to the catch block 
        // and if it is true then isVerified will contain some rendom value and pass the is statement 
            // we can also skip the if() conduction and directly write the statement inside it

        // req.cookies.isLoggedIn this hashValue contain payload (_id), so while verifying [_id] is not required
        let isVerified = jwt.verify(req.cookies.isLoggedIn, JWT_KEY);
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