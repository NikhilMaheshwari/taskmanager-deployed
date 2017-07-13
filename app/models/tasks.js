var mongoose = require('mongoose');

// define the schema for our user model
var taskSchema = mongoose.Schema({
    task_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    task_name: {
        type: String,
        required: true
    },
    description: String,
    start_date: Date,
    end_date: Date,
    due_date: Date,
    status: {
        type: String,
        enum: ['NotStarted', 'Running', 'Completed']
    },
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
    total_hours_spend: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Task', taskSchema);
