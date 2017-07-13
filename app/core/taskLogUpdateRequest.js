var TaskLogUpdateSchema = {
    type: 'object',
    properties: {
        task_id: {
            type: 'string'
        },
        hours_spend: {
            type: 'number',
        },
        date: {
            type: 'string'
        },
        required: ['task_id', 'hours_spend', 'date']
    }
}

module.exports = TaskLogUpdateSchema;
