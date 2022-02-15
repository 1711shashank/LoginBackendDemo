const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const db_link = "mongodb+srv://admin:1rpV7TSJstEeLJ2w@cluster0.ttoep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(db_link)
    .then(()=>{
        console.log("db connected");
    }).catch((err)=>{
        console.log(err);
    })


// database stracture
const userSchema = mongoose.Schema([{
    name:{
        type: String,
    },
    email: {
        type: String,
        unique:true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken:{
        type: String
    }
}])

userSchema.methods.createResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password){

    this.password = password;
    this.resetToken = undefined;

}

userSchema.pre('save', async function(){
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
})


const userDataBase = mongoose.model("userModal", userSchema);
module.exports = userDataBase;