const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: [true, "please add username"],
    }, email : {
        type: String,
        required : [true, "please add email address for user"],
        unique: [true, "email address taken already!!"],
    },
    password:{
        type: String,
        required: [true,"please add password for user"],
    },

},{
    timestamp: true,
});

module.exports = mongoose.model("User",userSchema);