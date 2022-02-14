const userDataBase = require('../models/mongoDB');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_KEY = 'skf453wdanj3rfj93nos';


module.exports.createAccount = async function createAccount(req, res) {
    let dataObj = req.body;
    let user = await userDataBase.create(dataObj);
    res.json({
        message: "Account created Successfully",
        data: user
    });
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
                    let jwtSign = jwt.sign({payload:uid},JWT_KEY);
                    // console.log(jwtSign);
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

