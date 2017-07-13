var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: String,
    photos: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
