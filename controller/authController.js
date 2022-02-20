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
            res.status(409).json({
                message: "User Already exist with this email ID",
                statusCode : 409
            });
        } else {
            let user = await userDataBase.create(dataObj);
            let obj = {
                email : dataObj.email,
                password : dataObj.password
            }
            sendMailFn("Sign Up", obj);
            console.log("Account created Successfully");

            res.status(200).json({
                message: "Account created Successfully",
                statusCode : 200,
                data: user
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            statusCode : 500
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
                    sendMailFn("Lg In", obj);
                    console.log("You Have LoggedIn");

                    res.status(200).json({
                        message: "LogIn Successfully",
                        statusCode : 200,
                        data: user
                        
                    });
                }
                else {
                    res.status(401).json({
                        message: "Invalid Password",
                        statusCode : 401
                    });
                }
            } else {
                res.status(403).json({
                    message: "User does not exist",
                    statusCode : 403
                });
            }
        }
        else {
            return res.status(400).json({
                message: 'Wrong credantials',
                statusCode : 400
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message:err.message,
            statusCode : 500
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
                resetToken: resetToken,
                resetPasswordLink : resetTokenLink
            }
            sendMailFn("Reset Password", obj);

            res.status(200).json({
                message:"Reset Password Link has been mailed to you",
                data: obj,
                statusCode : 200
            })
            
        } else {
            console.log("Please SignUp");
            res.status(511).json({
                message:"Please SignUp",
                statusCode : 511
            })
        }
        
    }
    catch (err) {
        res.status(500).json({
            message:err.message,
            statusCode : 500
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

            res.status(200).json({
                message:"Password Changed",
                statusCode : 200
            })
        } else {
            res.status(404).json({
                message:"User not found with this token",
                statusCode : 404
            })
        }
    } catch(err) {
        res.status(500).json({
            message: err.message,
            statusCode : 500
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