var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
const routes = require('./app/routes');

var dbConnManager = require('./app/db_manager/dbmanager');
dbConnManager();

require('./config/passport')(passport); // pass passport for configuration


app.use(flash()); // use connect-flash for flash messages stored in session

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'keyboard cat',
    key: 'sid'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use('/api', routes);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
