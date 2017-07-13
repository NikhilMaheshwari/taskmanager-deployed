var User = require('../models/user');

module.exports = function (user_id, done) {
    User.findOne({
        'user_id': user_id
    }, function (err, user) {
        console.log(user);
        if (err)
            done(err, null);

        done(null, user);
    });
}
