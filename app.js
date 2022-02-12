const express = require("express");
const { create } = require("./mongoDB");
const userDataBase = require('./mongoDB');

const app = express();
app.use(express.json());
app.listen(3000);

const authRouter = express.Router();
app.use('/', authRouter)

authRouter
.route('/signup')
.post(createAccount);

authRouter
.route('/login')
.post(loginUser);


// function getUser(req,res){
//     res.send(users);
// }

async function createAccount(req,res){
    let dataObj = req.body;
    let user = await userDataBase.create(dataObj);
    res.json({
        message:"Account created Successfully",
        data: user
    });
}

async function loginUser(req,res){
    let dataObj = req.body;
    let user = await userDataBase.findOne({email: dataObj.email});
    if(user){
        res.json({
            message:"LogIn Successfully",
            data: user
        });
    }else{
        res.json({
            message:"User does not exist",
        });
    }
    

}