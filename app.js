const express = require("express");
const userDataBase = require('./mongoDB');

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
    .get(getUserData);



// function getUser(req,res){
//     res.send(users);
// }

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
                if (user.password == dataObj.password) {
                    res.cookie('isLoggedIn', 'true');
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

function logoutUser(req,res){
    res.cookie('isLoggedIn', 'false');
    res.json({
        message:"User LogOut Successfully"
    })

}

function getUserData(req,res){
    let userData = req.body;
    // console.log(req.cookies);
    if(req.cookies.isLoggedIn === 'true'){
        res.json({
            message:"In the dashborad",
            res:userData
        })
    }
    else{
        res.json({
            message:"Please LogIn"
        })
    }
}