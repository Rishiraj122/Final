const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    state:{
        type: String,
        required: [true, 'Name cannot be empty']
    },
    city:{
        type: String,
        required: [true,'Name cannot be empty']
    },
    name:{
        type: String,
        required: [true,'Gender Cannot be Empty']
    },
    id:{
        type: Number,
        required: [true, 'Username cannot be blank']
    }
})

module.exports=mongoose.model('Branch',userSchema);