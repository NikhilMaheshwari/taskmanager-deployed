var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, {
            id: user.id,
            user_id: user.facebook != undefined ? user.facebook.user_id : ''
        });
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        User.findById(user.id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                User.findOne({
                    'local.email': email
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
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
            });
        }
    ));





    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({
                        'local.email': email
                    }, function (err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {

                            // create the user
                            var newUser = new User();

                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });
                    // if the user is logged in but has no local account...
                } else if (!req.user.local.email) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({
                        'local.email': email
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields,
        },

        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({
                    'facebook.user_id': profile.id
                }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        console.log(profile);

                        newUser = new User();
                        // set all of the facebook information in our user model
                        newUser.facebook.user_id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.facebook.name = profile.displayName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.facebook.username = profile.username;
                        newUser.facebook.photos = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'

                        console.log("DB save  : " + newUser);
                        // save our user to the database
                        newUser.save(function (err) {
                            if (err) {
                                console.log("DB add error.");
                                throw err;
                            }

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));
}
