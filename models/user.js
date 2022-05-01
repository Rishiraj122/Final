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
    address:{
        type: String,
        required: [true,'Address cannot be empty']
    },
    username:{
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    },
    mobile:{
        type: String,
        required: [true,'Mobile cannot be empty']
    },
    branch:{
        type: String,
        required: [false, 'Branch is to be setup by the Admin']
    },
    branchid:{
        type: Number,
        required: [false, 'Branch Id is going to be set by Admin']
    },
    Accountno:{
        type: String,
        required: [false, 'It will be autogenerated']
    },
    amount:{
        type: Number,
        required: [false, 'Minimum amount should be 200']
    },
    pin:{
        type: Number,
        required: [false, 'Pin is required only when dealing with cash']
    },
    cheque:{
        type:Number,
        required: [false,'Cheque id is required while depositing money']
    },
    date:{
        type: String,
        required: [false, 'Cheque Amount Deposited Date']
    },
    time:{
        type: String,
        required: [false, 'Cheque Amount Deposited Time']
    }
})

module.exports=mongoose.model('User',userSchema);