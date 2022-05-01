const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'Name cannot be empty']
    },
    lastname:{
        type: String,
        required: [true,'Name cannot be empty']
    },
    gender:{
        type: String,
        required: [true,'Gender Cannot be Empty']
    },
    username:{
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

module.exports=mongoose.model('Admin',userSchema);