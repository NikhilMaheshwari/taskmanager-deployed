var TaskCreateSchema = {
    type: 'object',
    properties: {
        task_name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        due_date: {
            type: 'string'
        },
    },
    required: ['description']
}

module.exports = TaskCreateSchema;
