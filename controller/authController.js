const userDataBase = require('../models/mongoDB');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_KEY = 'skf453wdanj3rfj93nos';


module.exports.createAccount = async function createAccount(req, res) {
    try{
        let dataObj = req.body;

        let oldUser = await userDataBase.findOne({ email: dataObj.email });
        if(oldUser){
            console.log("User Already exist with this email ID");
            res.json({
                message: "User Already exist with this email ID",
            });
        } else {

            let user = await userDataBase.create(dataObj);

            sendMailFn("Account Created", "Congratulation Your Account has been created Successfully", user.email);
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

                    sendMailFn("LonIn", "You Have LoggedIn", user.email);
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
    }
}

async function sendMailFn(subject, message, UserEmailID) {
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

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <1711shashank@gmail.com>', // sender address
            to: UserEmailID, // list of receivers
            subject: subject, // Subject line
            text: message // plain text body
        });
        // console.log("Message sent: %s", info.messageId);
    }
    catch (err) {
        console.log(err);
    }
}