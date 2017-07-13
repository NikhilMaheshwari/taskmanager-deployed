var TaskCreateSchema = {
    type: 'object',
    properties: {
        task_id: {
            type: 'string'
        },
        hours_spend: {
            type: 'number'
        }
    },
    required: ['task_id', 'hours_spend']
}

module.exports = TaskCreateSchema;
