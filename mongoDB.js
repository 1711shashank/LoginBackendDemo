const mongoose = require('mongoose');

const db_link = "mongodb+srv://admin:1rpV7TSJstEeLJ2w@cluster0.ttoep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(db_link)
    .then( ()=>{
        console.log("db connected");
    }).catch( (err)=>{
        console.log(err);
    })


// database stracture
const userSchema = mongoose.Schema({
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
})


const userDataBase = mongoose.model("userModal", userSchema);
module.exports = userDataBase;