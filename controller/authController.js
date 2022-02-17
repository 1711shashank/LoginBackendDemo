const userDataBase = require('../models/mongoDB');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { use } = require('./authRouter');
const JWT_KEY = 'skf453wdanj3rfj93nos';


module.exports.createAccount = async function createAccount(req, res) {
    try{
        let dataObj = req.body;
        console.log("Backend",dataObj);

        let oldUser = await userDataBase.findOne({ email: dataObj.email });
        if(oldUser){
            console.log("User Already exist with this email ID");
            res.json({
                message: "User Already exist with this email ID",
            });
        } else {
            let user = await userDataBase.create(dataObj);
            let obj = {
                email : dataObj.email,
                password : dataObj.password
            }
            sendMailFn("Sign Up", obj);
            console.log("Account created Successfully");

            res.json({
                message: "Account created Successfully",
                data: user
            });
        }
    }
    catch(err){
        res.json({
            message: err.message
        });
        
    }
}

module.exports.loginUser = async function loginUser(req, res) {
    try {
        let dataObj = req.body;
        res.cookie('isLoggedIn', 'false');
        if (dataObj.email && dataObj.password) {
            let user = await userDataBase.findOne({ email: dataObj.email });
            if (user) {
                let isVaildPassword = await bcrypt.compare(dataObj.password, user.password);
                if (isVaildPassword) {
                    let uid = user['_id'];
                    let jwtSign = jwt.sign({ payload: uid }, JWT_KEY);
                    res.cookie('isLoggedIn', jwtSign);

                    obj = {
                        email : dataObj.email
                    }
                    sendMailFn("Lon In", obj);
                    console.log("You Have LoggedIn");

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
        res.json({
            message:err.message
        })
    }
}

module.exports.forgetPassword = async function forgetPassword(req, res) {
    try {
        let {email} = req.body;
        let user = await userDataBase.findOne({ email : email });
        if(user){

            const resetToken = user.createResetToken();
            user.save();

            let resetTokenLink = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

            let obj = {
                email : email,
                resetPasswordLink : resetTokenLink
            }
            sendMailFn("Reset Password", obj);

            res.json({
                message:"Reset Password Link has been mailed to you",
                data: obj
            })
            
        } else {
            console.log("Please SignUp");
            res.json({
                message:"Please SignUp "
            })
        }
        
    }
    catch (err) {
        console.log(err);
        res.json({
            message:err.message
        })
    }
}

module.exports.resetPassword = async function resetPassword(req, res) {
    try{
        const token = req.params.hashToken;

        let {password} = req.body;
        const user = await userDataBase.findOne({resetToken : token});

        if(user){

            user.resetPasswordHandler(password);
            await user.save();

            res.json({
                message:"Password Changed"
            })
        } else {
            res.json({
                message:"User not found with this token"
            })
        }
    } catch(err) {
        res.json({
            message: err.message
        })
    }
   
}

async function sendMailFn(mailSubject, obj) {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "1711shashank@gmail.com", // generated ethereal user
                pass: "giurgozrmpmbncwa", // generated ethereal password
            },
        });

        if(mailSubject === "Sign Up"){
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <1711shashank@gmail.com>', // sender address
                to: obj.email, // list of receivers
                subject: mailSubject, // Subject line
                text: `Your account has been created \n email: ${obj.email} \n password: ${obj.password}` // plain text body
            });
        }
        else if(mailSubject === "Lon In"){
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <1711shashank@gmail.com>', // sender address
                to: obj.email, // list of receivers
                subject: mailSubject, // Subject line
                text: "You Have LoggedIn" // plain text body
            });
        }
        else if(mailSubject == "Reset Password"){
            console.log(obj.resetPasswordLink);
            let info = await transporter.sendMail({
                from: '"LogIn Page" <1711shashank@gmail.com>', // sender address
                to: obj.email, // list of receivers
                subject: mailSubject, // Subject line
                text: `Reset Password: ${obj.resetPasswordLink}` // plain text body
            });
        }

    }
    catch (err) {
        console.log(err);
    }
}