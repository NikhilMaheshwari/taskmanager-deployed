const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const options = {
    promiseLibrary: global.Promise,
    useMongoClient: true
};

//const URI = 'mongodb://nikhil:qwertyuiop@ds151202.mlab.com:51202/taskmanager';
const URI = 'mongodb://127.0.0.1:27017/taskmanager';

function connect() {
    mongoose.connect(URI, options)
        .then(function () {
            const admin = new mongoose.mongo.Admin(mongoose.connection.db);
            admin.buildInfo(function (err, info) {
                if (err) {
                    console.err(`Error getting MongoDB info: ${err}`);
                } else {
                    console.log(`Connection to MongoDB (version ${info.version}) opened successfully!`);
                }
            });
        })
        .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));
}

module.exports = connect;
