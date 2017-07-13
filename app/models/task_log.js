var mongoose = require('mongoose');

// define the schema for our user model
var taskLogSchema = mongoose.Schema({
    task_id: {
        type: String,
        required: true
    },
    date: Date,
    created_on: {
        type: Date,
        default: Date.now
    },
    created_by: String,
    modified_on: {
        type: Date,
        default: Date.now
    },
    modified_by: String,
    hours_spend: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('TaskLog', taskLogSchema);
