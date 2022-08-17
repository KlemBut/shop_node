const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userScheme = new Schema({
    image: {
        type:String,
        required:true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('shopUsers', userScheme)