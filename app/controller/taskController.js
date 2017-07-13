var User = require('../models/user');
var Task = require('../models/tasks');
var uuid = require('uuid');

module.exports.save = function (user, task, callback) {
    newTask = new Task();
    newTask.task_id = uuid.v1();
    newTask.user_id = user.user_id;
    newTask.task_name = task.task_name;
    newTask.description = task.description;
    newTask.due_date = task.due_date;
    newTask.status = 'NotStarted';
    newTask.created_on = new Date();
    newTask.created_by = user.user_id;
    newTask.modified_on = new Date();
    newTask.modified_by = user.user_id;
    newTask.total_hours_spend = 0;
    newTask.save(function (err) {
        if (err) {
            callback(err);
        } else {
            console.log("Inserted a document into the restaurants collection.");
            callback(null);
        }
    })
}

module.exports.getAllTasks = function (callback) {
    Task.find({}, function (err, tasks) {
        if (err) {
            callback(err, null);
        } else {
            if (tasks.length == 0) {
                err = "No active task found for hours logging.";
                callback(err, null);
            } else {
                callback(null, tasks);
            }
        }
    })
}
module.exports.updateTotalHours = function (userId, taskId, totalHours, callback) {
    currentStatus = 'Running';

    Task.find({
        'user_id': userId,
        'task_id': taskId,
        'status': currentStatus
    }, function (err, tasks) {
        if (err) {
            callback(err, null);
        } else {
            if (tasks.length == 0) {
                err = "No active task found for hours logging.";
                callback(err, null);
            } else {
                var oldHours = tasks[0].total_hours_spend;
                var newHours = oldHours + totalHours;

                Task.update({
                    'user_id': userId,
                    'task_id': taskId,
                    'status': currentStatus
                }, {
                    'total_hours_spend': newHours,
                    'modified_on': new Date(),
                    'modified_by': userId
                }, function (err, affected, resp) {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log("update success and total affected rows : " + affected);
                        callback(null, resp);
                    }
                });
            }
        }
    });
}

module.exports.getByUserId = function (userId, callback) {
    Task.find({
        'user_id': userId
    }, function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            console.log("Fetch success for userId");
            console.log(docs);
            callback(null, docs);
        }
    })
}

module.exports.getByTaskId = function (userId, taskId, callback) {
    Task.findOne({
        'user_id': userId,
        'task_id': taskId
    }, function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            console.log("Fetch success for userId");
            console.log(docs);
            callback(null, docs);
        }
    })
}

module.exports.startTask = function (taskId, userId, callback) {
    currentStatus = 'NotStarted';
    nextStatus = 'Running';
    startDate = new Date();
    Task.update({
        'user_id': userId,
        'task_id': taskId,
        'status': currentStatus
    }, {
        'status': nextStatus,
        'start_date': startDate,
        'modified_on': startDate,
        'modified_by': userId
    }, function (err, affected, resp) {
        if (err) {
            callback(err, null);
        } else {
            console.log("update success and total affected rows : " + JSON.stringify(affected));
            callback(null, resp);
        }
    })
}

module.exports.endTask = function (taskId, userId, callback) {
    currentStatus = 'Running';
    nextStatus = 'Completed';
    endDate = new Date();
    Task.update({
        'user_id': userId,
        'task_id': taskId,
        'status': currentStatus
    }, {
        'status': nextStatus,
        'start_date': endDate,
        'modified_on': endDate,
        'modified_by': userId
    }, function (err, affected, resp) {
        if (err) {
            callback(err, null);
        } else {
            console.log("update success and total affected rows : " + affected);
            callback(null, resp);
        }
    })
}
