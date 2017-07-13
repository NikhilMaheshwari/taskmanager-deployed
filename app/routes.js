const routes = require('express').Router();
const passport = require('passport');
var validate = require('express-jsonschema').validate;
const taskRequestValidator = require('./core/tasksRequest');
const taskLogRequestValidator = require('./core/taskLogRequest');
const taskLogUpdateRequestValidator = require('./core/taskLogUpdateRequest');

const loginController = require('./controller/loginController')(passport);
const adminLoginController = require('./controller/admin/loginController');
const userController = require('./controller/userController');
const taskController = require('./controller/taskController');
const taskLogController = require('./controller/taskLogController');

routes.post('/admin/signup', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.status(409).json({
                errMsg: info.errMsg
            });
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.redirect('/#/admin/tasks');
        });
    })(req, res, next);
});

routes.post('/admin/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.status(409).json({
                errMsg: info.errMsg
            });
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.redirect('/#/admin/tasks');
        });
    })(req, res, next);
});

routes.post('/admin/task', function (req, res, next) {
    taskController.getAllTasks(function (err, tasks) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            });
        }
        return res.status(200).json({
            tasks: tasks,
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/admin/loginCheck', (req, res) => {
    console.log(req.body);
    var isLoggedIn = req.isAuthenticated();
    res.status(200).json({
        data: {
            status: isLoggedIn
        }
    });
});


routes.get('/admin/logout', function (req, res) {
    req.logout();
    res.redirect('/#/admin');
});

routes.post('/task/create', isLoggedIn, validate({
    body: taskRequestValidator
}), (req, res) => {
    console.log(req.body);
    console.log(req.user);

    taskController.save(req.user, req.body, function (err) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            })
        }

        res.status(200).json({
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task', isLoggedIn, (req, res) => {
    console.log(req.user);

    taskController.getByUserId(req.user.user_id, function (err, tasks) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            });
        }
        return res.status(200).json({
            tasks: tasks,
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task/:taskId/start', isLoggedIn, (req, res) => {
    console.log(req.user);

    taskController.startTask(req.params.taskId, req.user.user_id, function (err, donee) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            });
        }
        return res.status(200).json({
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task/:taskId/stop', isLoggedIn, (req, res) => {
    console.log(req.user);

    taskController.endTask(req.params.taskId, req.user.user_id, function (err, donee) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            });
        }
        return res.status(200).json({
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task/:taskId/log/create', isLoggedIn, validate({
    body: taskLogRequestValidator
}), (req, res) => {

    taskLogController.save(req.user, req.body, function (err) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            })
        }

        res.status(200).json({
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task/:taskId/log/update', isLoggedIn, validate({
    body: taskLogUpdateRequestValidator
}), (req, res) => {

    taskLogController.update(req.user, req.body, function (err) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            })
        }

        res.status(200).json({
            message: "Success",
            isSuccess: true
        });
    });
});

routes.post('/task/:taskId/log', isLoggedIn, (req, res) => {

    taskLogController.getAllLogForTask(req.params.taskId, function (err, taskLog) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            });
        }
        taskController.getByTaskId(req.user.user_id, req.params.taskId, function (err, tasks) {
            if (err) {
                return res.status(200).json({
                    message: err,
                    isSuccess: false
                });
            }
            return res.status(200).json({
                task: tasks,
                taskLog: taskLog,
                message: "Success",
                isSuccess: true
            });
        })

    });
});


routes.post('/profile', isLoggedIn, (req, res) => {

    userController(profileId, function (err, user) {
        if (err) {
            return res.status(200).json({
                message: err,
                isSuccess: false
            })
        }

        if (user) {
            return res.status(403).json({
                message: "user not found. contact admin.",
                isSuccess: false
            })
        }
        res.status(200).json({
            user: user,
            message: "Success",
            isSuccess: true
        });
    });

});

routes.get('/loginCheck', (req, res) => {
    var isLoggedIn = req.isAuthenticated();
    res.status(200).json({
        data: {
            status: isLoggedIn
        }
    });
});
routes.get('/auth', passport.authenticate('facebook', {
    scope: 'email',
    authType: 'reauthenticate',
    authNonce: 'foo123'
}));

routes.get('/auth/failure', isLoggedIn, (req, res) => {
    res.status(200).json({
        message: 'failure in authentication. try again.'
    });
});

routes.get('/notallowed', (req, res) => {
    res.status(403).json({
        message: 'Access forbidden!'
    });
});


routes.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

routes.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/#/'
    }),
    function (req, res) {
        res.redirect('/#/tasks');
    });

routes.get('/profile',
    function (req, res) {
        res.status(200).json(req.user);
    });


routes.use(function (err, req, res, next) {

    var responseData;
    console.log("In the middleware");
    console.log(JSON.stringify(err));
    if (err.name === 'JsonSchemaValidation') {
        // Log the error however you please 
        console.log(JSON.stringify(err.message));
        // logs "express-jsonschema: Invalid data found" 

        // Set a bad request http response status or whatever you want 
        res.status(400);

        // Format the response body however you want 
        responseData = {
            statusText: 'Bad Request',
            jsonSchemaValidation: true,
            validations: err.validations // All of your validation information 
        };

        // Take into account the content type if your app serves various content types 
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        } else {
            // If this is an html request then you should probably have 
            // some type of Bad Request html template to respond with 
            res.render('badrequestTemplate', responseData);
        }
    } else {
        // pass error to next error middleware handler 
        next(err);
    }
});

module.exports = routes;

/*module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/admin/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/admin/login', passport.authenticate('local-login', {
        successRedirect: '/admin/profile', // redirect to the secure profile section
        failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};*/

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(403).json({
        'message': 'UnAuthorized access ! '
    });
}
