var
    passport = require('passport'),
    AdminUser = require('../../models/localUser'),
    userController = require('./userController');
/**
 *Module variables
 */
var
    errHandler = userController.errHandler,
    LocalStrategy = require('passport-local').Strategy;
/**
 *Configuration and Settings
 */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    AdminUser.findById(id, function (err, user) {
        if (err) {
            console.error('There was an error accessing the records of' +
                ' user with id: ' + id);
            return console.log(err.message);
        }
        return done(null, user);
    })
});
/**
 *Strategies
 */
//---------------------------Local Strategy-------------------------------------
passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        process.nextTick(function () {
            AdminUser.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    return errHandler(err);
                }
                if (user) {
                    console.log('user already exists');
                    return done(null, false, {
                        errMsg: 'email already exists'
                    });
                } else {
                    var newUser = new AdminUser();
                    newUser.username = req.body.email;
                    newUser.email = "nikhil@gmail.com";
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                            if (err.message == 'User validation failed') {
                                console.log(err.message);
                                return done(null, false, {
                                    errMsg: 'Please fill all fields'
                                });
                            }
                            return errHandler(err);
                        }
                        console.log('New user successfully created...', newUser.username);
                        console.log('email', email);
                        console.log(newUser);
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
//---------------------------local login----------------------------------------
passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        AdminUser.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return errHandler(err);
            }
            if (!user) {
                return done(null, false, {
                    errMsg: 'User does not exist, please' +
                        ' <a class="errMsg" href="/signup">signup</a>'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    errMsg: 'Invalid password try again'
                });
            }
            return done(null, user);
        });

    }));
/**
 *Export Module
 */
module.exports = passport;
