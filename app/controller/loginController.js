var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

var configAuth = require('../../config/auth');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        User.findOne({
            'user_id': user.user_id
        }, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields
        },

        function (token, refreshToken, profile, done) {

            process.nextTick(function () {

                User.findOne({
                    'user_id': profile.id
                }, function (err, user) {
                    console.log(user);
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {

                        newUser = new User();
                        newUser.user_id = profile.id;
                        newUser.token = token;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value;
                        newUser.username = profile.username;
                        newUser.photos = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};
