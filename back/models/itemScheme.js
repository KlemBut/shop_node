const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemScheme = new Schema({
    owner: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    title: {
        type:String,
        required: true
    }
    
})

module.exports = mongoose.model('items', itemScheme)