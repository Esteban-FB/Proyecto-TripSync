const mongoose = require('mongoose');

const LogInSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    rol:{
        type:String,
        required:true
    }
});


const LogInModel = mongoose.model('LogIn',LogInSchema,"Usuarios");

module.exports = LogInModel;