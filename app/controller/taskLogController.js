var User = require('../models/user');
var Task = require('../models/tasks');
var TaskLog = require('../models/task_log');
const taskController = require('./taskController');
var uuid = require('uuid');

module.exports.save = function (user, taskLog, callback) {
    newTask = new TaskLog();
    newTask.task_id = taskLog.task_id;
    newTask.date = new Date();
    newTask.created_on = new Date();
    newTask.created_by = user.facebook.user_id;
    newTask.modified_on = new Date();
    newTask.modified_by = user.facebook.user_id;
    newTask.hours_spend = taskLog.hours_spend;
    newTask.save(function (err) {
        if (err) {
            callback(err);
        } else {
            console.log("Inserted a document into the restaurants collection.");
            taskController.updateTotalHours(user.user_id, taskLog.task_id, taskLog.hours_spend, callback);
        }
    })
}

module.exports.update = function (user, taskLog, callback) {
    TaskLog.update({
        'task_id': taskLog.task_id,
        'date': taskLog.date
    }, {
        'hours_spend': taskLog.hours_spend,
        'modified_on': new Date(),
        'modified_by': user.facebook.user_id
    }, function (err, affected, resp) {
        if (err) {
            callback(err, null);
        } else {
            console.log("update success and total affected rows : " + affected);
            var changeHours = taskLog.hours_spend - taskLog.hours_spend_earlier;
            taskController.updateTotalHours(user.user_id, taskLog.task_id, changeHours, callback);
        }
    });
}

module.exports.getAllLogForTask = function (taskId, callback) {
    TaskLog.find({
        'task_id': taskId
    }, function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            console.log("Fetch success for userId");
            callback(null, docs);
        }
    })
}
