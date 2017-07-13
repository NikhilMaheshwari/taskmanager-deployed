var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields
        },

        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({
                    'user_id': profile.id
                }, function (err, user) {
                    console.log(user);
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them

                        newUser = new User();
                        // set all of the facebook information in our user model
                        newUser.user_id = profile.id; // set the users facebook id                   
                        newUser.token = token; // we will save the token that facebook provides to the user                    
                        newUser.name = profile.displayName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.username = profile.username;
                        newUser.photos = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};
