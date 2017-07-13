var AdminUserModel = require('../../models/localUser');
//==============================================================================
/**
 *User Model Utility functions
 */
function errHandler(err) {
    console.error('There was an error performing the operation');
    console.log(err);
    console.log(err.code);
    return console.error(err.message);
}

function validationErr(err, res) {
    Object.keys(err.errors).forEach(function (k) {
        var msg = err.errors[k].message;
        console.error('Validation error for \'%s' + ': %s', k, msg);
        return res.status(404).json({
            msg: 'Please ensure required fields are filled'
        });
    });
}

function cr8NewUser(req, res) {
    return AdminUserModel.create({
        email: req.body.email,
        password: req.body.password,
    }, function (err, user) {
        if (err) {
            console.error('There was an error creating the user');
            console.error(err.code);
            console.error(err.name);
            if (err.name == 'ValidationError') {
                return validationErr(err, res);
            } else {
                return errHandler(err);
            }
        }
        console.log('New user successfully created...');
        console.log(user.email);
        return res.json({
            msg: 'User created!',
            id: user._id,
            email: user.email
        });
    })
}

function findUser(req, res) {
    return AdminUserModel.findOne({
            email: req.params.email
        }, 'email',
        function (err, user) {
            if (err) {
                return errHandler(err);
            }
            if (user == null) {
                return res.json({
                    msg: 'User does not exist in the dBase, please' +
                        ' sign up to login as a user'
                });
            }
            console.log(user.email);
            return res.json(user);
        });
}
module.exports = {
    errHandler: errHandler,
    validationErr: validationErr,
    cr8NewUser: cr8NewUser,
    findUser: findUser
};
