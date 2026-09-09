import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Eye, EyeOff, KeyRound, Copy, Check, 
    ShieldCheck, User, AlignLeft, Globe, Plus, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

const VaultItemModal = ({
    isOpen,
    onClose,
    onSave,
    editingItem = null
}) => {
    const [name, setName] = useState('');
    const [idField, setIdField] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    const [customFields, setCustomFields] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setName(editingItem.name || '');
            setIdField(editingItem.decrypted?.id || '');
            setPassword(editingItem.decrypted?.password || '');
            setDescription(editingItem.decrypted?.description || '');
            setCustomFields(
                Array.isArray(editingItem.decrypted?.customFields) 
                    ? editingItem.decrypted.customFields 
                    : []
            );
        } else {
            setName('');
            setIdField('');
            setPassword('');
            setDescription('');
            setCustomFields([]);
        }
        setShowPassword(false);
        setCopiedField(null);
    }, [editingItem, isOpen]);

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        toast.success(`${fieldName} copied to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Add Custom Field Pair
    const handleAddCustomField = () => {
        setCustomFields(prev => [
            ...prev,
            { id: Date.now().toString(), label: '', value: '' }
        ]);
    };

    // Update Custom Field
    const handleUpdateCustomField = (index, key, val) => {
        setCustomFields(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: val };
            return next;
        });
    };

    // Remove Custom Field
    const handleRemoveCustomField = (index) => {
        setCustomFields(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter a name / title for this credential.");
            return;
        }
        if (!idField.trim() && !password.trim() && customFields.length === 0) {
            toast.error("Please provide at least an ID, a Password, or a Custom Field.");
            return;
        }

        // Filter valid custom fields
        const validCustomFields = customFields
            .filter(f => f.label.trim() || f.value.trim())
            .map(f => ({
                id: f.id || Date.now().toString(),
                label: f.label.trim() || "Field",
                value: f.value // keep case-sensitive
            }));

        setIsSubmitting(true);
        try {
            await onSave({
                name: name.trim(),
                id: idField, // exact case-sensitive
                password: password, // exact case-sensitive
                description: description,
                customFields: validCustomFields
            });
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save credential.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                    {editingItem ? 'Edit Credential' : 'Add New Credential'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    End-to-End Encrypted in your browser
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Body - Scrollable */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                        {/* 1. Name / Title Field */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Name / Service <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <Globe className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Google Account, Bank Login, AWS"
                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* 2. ID / Username Field with Copy Button */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                ID / Username / Email
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={idField}
                                    onChange={(e) => setIdField(e.target.value)}
                                    placeholder="e.g., username, user@email.com, 10482930"
                                    className="w-full pl-9 pr-11 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                />
                                {idField && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(idField, "ID / Username")}
                                        title="Copy ID"
                                        className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {copiedField === "ID / Username" ? (
                                            <Check className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 3. Password Field with Copy and Eye Toggle */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Password (Case-Sensitive)
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <KeyRound className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full pl-9 pr-20 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Hide password" : "Show password"}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    {password && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(password, "Password")}
                                            title="Copy Password"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            {copiedField === "Password" ? (
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 4. Dynamic Custom Fields Section */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Custom Fields <span className="text-slate-400 font-normal">({customFields.length})</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddCustomField}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Field
                                </button>
                            </div>

                            {customFields.length > 0 && (
                                <div className="space-y-2">
                                    {customFields.map((field, idx) => (
                                        <div 
                                            key={field.id || idx}
                                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800"
                                        >
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => handleUpdateCustomField(idx, 'label', e.target.value)}
                                                placeholder="Field Name (e.g. PIN, Secret, Account)"
                                                className="w-1/3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <div className="relative flex-1 flex items-center">
                                                <input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => handleUpdateCustomField(idx, 'value', e.target.value)}
                                                    placeholder="Value"
                                                    className="w-full pl-2.5 pr-8 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(field.value, field.label || `Field ${idx + 1}`)}
                                                        title="Copy Value"
                                                        className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        {copiedField === (field.label || `Field ${idx + 1}`) ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCustomField(idx)}
                                                title="Remove Field"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. Description Field (Optional) */}
                        <div className="space-y-1.5 pt-1">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Description / Notes <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                    <AlignLeft className="w-4 h-4" />
                                </span>
                                <textarea
                                    rows="2"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Security questions, recovery codes, or notes..."
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                {isSubmitting ? "Encrypting..." : editingItem ? "Save Changes" : "Save Credential"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default VaultItemModal;
