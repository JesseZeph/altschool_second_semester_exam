const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: '',
        required: true,
    },
    firstname: {
        type: String,
        default: '',
        required: true,
    },
    lastname: {
        type: String,
        default: '',
        required: true,
    },

})

module.exports = mongoose.model('User', UserSchema);