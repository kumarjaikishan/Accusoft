import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useApi } from '../../utils/useApi';
import { toast } from '../../utils/toast';
import { confirmDialog } from '../../utils/confirm';
import DataTable from '../../components/common/DataTable';
import { useTableStyles } from '../../components/dataTableStyle';
import {
    CheckCircle2,
    Circle,
    Plus,
    Search,
    Trash2,
    Edit2,
    Calendar,
    Tag,
    AlertCircle,
    CheckSquare,
    Clock,
    Sparkles,
    Flame,
    X,
    Filter
} from 'lucide-react';
import dayjs from 'dayjs';
import ModalCard from '../../components/custommodal/ModalCard';
import TextInput from '../../components/common/TextInput';
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import { capitalize } from './ledger/ledgerHelpers';

const TodoPage = () => {
    const mode = useSelector((state) => state.theme?.mode || 'light');
    const { request, loading } = useApi();
    const baseTableStyles = useTableStyles();

    const [todos, setTodos] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        urgent: 0,
        categories: []
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'General',
        dueDate: '',
        tags: ''
    });

    // Fetch todos
    const fetchTodos = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (priorityFilter !== 'all') params.append('priority', priorityFilter);
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (searchQuery.trim()) params.append('search', searchQuery.trim());

            const res = await request({
                url: `util/todos?${params.toString()}`,
                method: 'GET'
            });

            if (res?.success) {
                setTodos(res.todos || []);
                setStats(res.stats || { total: 0, completed: 0, pending: 0, urgent: 0, categories: [] });
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [statusFilter, priorityFilter, categoryFilter, searchQuery]);

    // Toggle todo status
    const handleToggle = async (todo) => {
        // Optimistic UI update
        setTodos((prev) =>
            prev.map((t) => (t._id === todo._id ? { ...t, completed: !t.completed } : t))
        );

        try {
            await request({
                url: `util/todos/${todo._id}/toggle`,
                method: 'PATCH',
                silent: true
            });
            fetchTodos();
        } catch (error) {
            fetchTodos(); // Rollback
        }
    };

    // Save Todo
    const handleSaveTodo = async (e) => {
        e.preventDefault();
        const capitalizedTitle = capitalize(formData.title);
        if (!capitalizedTitle) {
            toast.error('Task title is required');
            return;
        }

        const tagsArray = formData.tags
            ? formData.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        const payload = {
            title: capitalizedTitle,
            description: formData.description.trim(),
            priority: formData.priority,
            category: capitalize(formData.category) || 'General',
            dueDate: formData.dueDate || null,
            tags: tagsArray
        };

        try {
            if (editingTodo) {
                await request({
                    url: `util/todos/${editingTodo._id}`,
                    method: 'PUT',
                    data: payload
                });
                toast.success('Task updated');
            } else {
                await request({
                    url: 'util/todos',
                    method: 'POST',
                    data: payload
                });
                toast.success('Task added');
            }
            setIsModalOpen(false);
            setEditingTodo(null);
            fetchTodos();
        } catch (error) {
            // Handled in useApi
        }
    };

    // Open Edit
    const handleEdit = (todo, e) => {
        e?.stopPropagation();
        setEditingTodo(todo);
        setFormData({
            title: todo.title || '',
            description: todo.description || '',
            priority: todo.priority || 'MEDIUM',
            category: todo.category || 'General',
            dueDate: todo.dueDate ? dayjs(todo.dueDate).format('YYYY-MM-DD') : '',
            tags: (todo.tags || []).join(', ')
        });
        setIsModalOpen(true);
    };

    // Delete Single Todo
    const handleDelete = async (todo, e) => {
        e?.stopPropagation();
        const confirm = await confirmDialog({
            title: `Delete task "${todo.title}"?`,
            text: 'This will permanently remove this task from your list.',
            icon: 'warning',
            buttons: ['Cancel', 'Delete Task'],
            dangerMode: true
        });

        if (confirm) {
            try {
                await request({
                    url: `util/todos/${todo._id}`,
                    method: 'DELETE'
                });
                toast.success('Task deleted');
                fetchTodos();
            } catch (error) {
                // Handled in useApi
            }
        }
    };

    // Clear completed
    const handleClearCompleted = async () => {
        const confirm = await confirmDialog({
            title: 'Clear all completed tasks?',
            text: 'This will permanently remove all completed items from your list.',
            icon: 'warning',
            buttons: ['Cancel', 'Clear All'],
            dangerMode: true
        });

        if (confirm) {
            try {
                await request({
                    url: 'util/todos/clear-completed',
                    method: 'POST'
                });
                toast.success('Completed tasks cleared');
                fetchTodos();
            } catch (error) {
                // Handled in useApi
            }
        }
    };

    // Priority Styling Helper
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'URGENT':
                return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            case 'HIGH':
                return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'MEDIUM':
                return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
            case 'LOW':
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        }
    };

    const customTableStyles = useMemo(() => ({
        ...baseTableStyles,
        rows: {
            ...baseTableStyles?.rows,
            style: {
                ...baseTableStyles?.rows?.style,
                minHeight: '44px',
            },
        },
        cells: {
            ...baseTableStyles?.cells,
            style: {
                ...baseTableStyles?.cells?.style,
                paddingTop: '6px',
                paddingBottom: '6px',
            },
        },
    }), [baseTableStyles]);

    const columns = useMemo(() => [
        {
            name: 'Status',
            width: '65px',
            center: true,
            cell: (row) => (
                <button
                    onClick={() => handleToggle(row)}
                    className="text-slate-400 hover:text-emerald-600 transition cursor-pointer inline-flex items-center justify-center p-1"
                    title={row.completed ? 'Mark as Pending' : 'Mark as Completed'}
                >
                    {row.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <Circle className="w-5 h-5" />
                    )}
                </button>
            ),
        },
        {
            name: 'Task & Description',
            grow: 3,
            cell: (row) => (
                <div className="py-1">
                    <h4
                        className={`font-bold text-xs sm:text-sm text-slate-900 dark:text-white ${
                            row.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                    >
                        {row.title}
                    </h4>
                    {row.description && (
                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                            {row.description}
                        </p>
                    )}
                    {row.tags?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px]">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {row.tags.map((tg, i) => (
                                <span key={i} className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                    #{tg}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            name: 'Category',
            selector: (row) => row.category || 'General',
            sortable: true,
            width: '120px',
            cell: (row) => (
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {row.category || 'General'}
                </span>
            ),
        },
        {
            name: 'Priority',
            selector: (row) => row.priority,
            sortable: true,
            center: true,
            width: '110px',
            cell: (row) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getPriorityBadge(row.priority)}`}>
                    {row.priority}
                </span>
            ),
        },
        {
            name: 'Due Date',
            selector: (row) => row.dueDate || '',
            sortable: true,
            width: '140px',
            cell: (row) => {
                const isOverdue = row.dueDate && !row.completed && dayjs(row.dueDate).isBefore(dayjs(), 'day');
                return row.dueDate ? (
                    <div
                        className={`flex items-center gap-1 text-[11px] font-medium ${
                            isOverdue
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                            {dayjs(row.dueDate).format('DD MMM, YYYY')}
                            {isOverdue && ' (Overdue)'}
                        </span>
                    </div>
                ) : (
                    <span className="text-slate-400 text-xs">—</span>
                );
            },
        },
        {
            name: 'Actions',
            center: true,
            width: '90px',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Task"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Delete Task"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ], [baseTableStyles]);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 lg:p-6 space-y-5 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckSquare className="w-6 h-6 text-emerald-600" />
                        <span>Action & Task Manager</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage your company operations, reminders, and daily financial to-dos
                    </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    {stats.completed > 0 && (
                        <button
                            onClick={handleClearCompleted}
                            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition cursor-pointer text-center"
                        >
                            Clear Completed ({stats.completed})
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setEditingTodo(null);
                            setFormData({
                                title: '',
                                description: '',
                                priority: 'MEDIUM',
                                category: 'General',
                                dueDate: '',
                                tags: ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <span className="text-[10.5px] sm:text-[11px] font-bold uppercase text-slate-400">Total Tasks</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stats.total}</h3>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <span className="text-[10.5px] sm:text-[11px] font-bold uppercase text-amber-500">Pending</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1">{stats.pending}</h3>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <span className="text-[10.5px] sm:text-[11px] font-bold uppercase text-emerald-600">Completed</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1">{stats.completed}</h3>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <span className="text-[10.5px] sm:text-[11px] font-bold uppercase text-rose-500 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> Urgent
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 sm:mt-1">{stats.urgent}</h3>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks, descriptions, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Status filter tabs */}
                    <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {['all', 'pending', 'completed'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                                    statusFilter === st
                                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    {/* Priority filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="URGENT">Urgent</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    {/* Category filter */}
                    {stats.categories?.length > 0 && (
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {stats.categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Todo Table Form */}
            <div className="bg-surface rounded-xl shadow-md border border-border-subtle overflow-hidden relative">
                <DataTable
                    columns={columns}
                    data={todos}
                    theme={mode === 'dark' ? 'dark' : 'default'}
                    pagination
                    paginationPerPage={15}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    highlightOnHover
                    customStyles={customTableStyles}
                    noDataComponent={
                        <div className="py-16 text-center text-content bg-surface">
                            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                                <Sparkles className="w-7 h-7 text-emerald-500" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No tasks found</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                                {searchQuery ? 'No task matched your search criteria.' : 'Keep yourself organized by adding your first action item or reminder.'}
                            </p>
                            <button
                                onClick={() => {
                                    setEditingTodo(null);
                                    setIsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Add Task
                            </button>
                        </div>
                    }
                />
            </div>

            {/* ================= MODAL: ADD / EDIT TODO ================= */}
            <ModalCard
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTodo ? 'Edit Task' : 'Create New Task'}
                width="480px"
            >
                <form
                    onSubmit={handleSaveTodo}
                    className="flex flex-col pt-4 items-center w-full px-5 sm:px-6 pb-6 gap-3.5"
                >
                    <div className="w-full">
                        <TextInput
                            label="Task Title"
                            name="title"
                            required
                            placeholder="e.g. Reconcile monthly sales ledger, Pay utility bill"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="w-full">
                        <TextInput
                            multiline
                            rows={2.5}
                            label="Description (Optional)"
                            name="description"
                            placeholder="Add any extra instructions or notes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent 🔥</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <TextInput
                                label="Category"
                                name="category"
                                placeholder="e.g. Accounts, Operations"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <div className="w-full">
                            <DatePicker
                                label="Due Date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div className="w-full">
                            <TextInput
                                label="Tags (comma separated)"
                                name="tags"
                                placeholder="urgent, payroll"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="w-full flex justify-between items-center gap-3 mt-3 pt-2">
                        <Button
                            type="submit"
                            loading={loading}
                            icon={editingTodo ? Edit2 : Plus}
                            className="flex-1 text-white shadow-md"
                        >
                            {editingTodo ? 'Update Task' : 'Save Task'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </ModalCard>
        </div>
    );
};

export default TodoPage;
