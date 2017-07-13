var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        user_id: {
            type: String
        },
        token: {
            type: String
        },
        email: {
            type: String
        },
        name: {
            type: String
        },
        username: String,
        photos: String,
        type: {
            type: String,
            default: "normal"
        }
    }
});
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
