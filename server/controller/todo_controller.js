const Todo = require('../modals/todo_schema');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');

/**
 * Get all todos for authenticated user with filters & search
 */
const getTodos = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { status, priority, category, search } = req.query;

    const filter = { userid: userId };

    if (status === 'completed') {
        filter.completed = true;
    } else if (status === 'pending') {
        filter.completed = false;
    }

    if (priority && priority !== 'all') {
        filter.priority = priority.toUpperCase();
    }

    if (category && category !== 'all') {
        filter.category = category;
    }

    if (search && search.trim()) {
        filter.$or = [
            { title: { $regex: search.trim(), $options: 'i' } },
            { description: { $regex: search.trim(), $options: 'i' } },
            { tags: { $in: [new RegExp(search.trim(), 'i')] } }
        ];
    }

    const todos = await Todo.find(filter).sort({ completed: 1, dueDate: 1, createdAt: -1 }).lean();

    // Aggregated stats
    const allUserTodos = await Todo.find({ userid: userId }).lean();
    const stats = {
        total: allUserTodos.length,
        completed: allUserTodos.filter(t => t.completed).length,
        pending: allUserTodos.filter(t => !t.completed).length,
        urgent: allUserTodos.filter(t => !t.completed && t.priority === 'URGENT').length,
        categories: [...new Set(allUserTodos.map(t => t.category).filter(Boolean))]
    };

    res.status(200).json({
        success: true,
        stats,
        todos
    });
});

/**
 * Create a new todo
 */
const createTodo = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { title, description, priority, category, dueDate, tags } = req.body;

    if (!title || !title.trim()) {
        throw new ApiError(400, 'Title is required');
    }

    const todo = await Todo.create({
        userid: userId,
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'MEDIUM',
        category: category?.trim() || 'General',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: Array.isArray(tags) ? tags.map(t => t.trim()).filter(Boolean) : []
    });

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        todo
    });
});

/**
 * Update todo details
 */
const updateTodo = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;
    const { title, description, priority, category, dueDate, tags, completed } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category.trim();
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.map(t => t.trim()).filter(Boolean) : [];
    if (completed !== undefined) updateData.completed = Boolean(completed);

    const updated = await Todo.findOneAndUpdate(
        { _id: id, userid: userId },
        updateData,
        { returnDocument: 'after' }
    );

    if (!updated) {
        throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        todo: updated
    });
});

/**
 * Toggle todo completed status
 */
const toggleTodo = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userid: userId });
    if (!todo) {
        throw new ApiError(404, 'Task not found');
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
        success: true,
        message: todo.completed ? 'Task marked as completed' : 'Task marked as pending',
        todo
    });
});

/**
 * Delete todo
 */
const deleteTodo = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const deleted = await Todo.findOneAndDelete({ _id: id, userid: userId });
    if (!deleted) {
        throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
    });
});

/**
 * Clear completed todos in bulk
 */
const clearCompletedTodos = asyncHandler(async (req, res) => {
    const userId = req.userid;

    const result = await Todo.deleteMany({ userid: userId, completed: true });

    res.status(200).json({
        success: true,
        message: `Cleared ${result.deletedCount} completed task(s)`
    });
});

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos
};
