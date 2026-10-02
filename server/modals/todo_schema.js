const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
        index: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    },
    dueDate: {
        type: Date,
        default: null
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });

todoSchema.index({ userid: 1, completed: 1, createdAt: -1 });

const Todo = mongoose.model('todo', todoSchema);
module.exports = Todo;
