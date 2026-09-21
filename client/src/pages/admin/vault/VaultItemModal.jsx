import React, { useState, useEffect } from 'react';
import {
    X, Eye, EyeOff, KeyRound, Copy, Check,
    ShieldCheck, User, AlignLeft, Globe, Plus, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import Modalbox from '../../../components/custommodal/Modalbox';

const VaultItemModal = ({
    isOpen,
    onClose,
    onSave,
    editingItem = null
}) => {
    const [name, setName] = useState('');
    const [idLabel, setIdLabel] = useState('ID');
    const [idField, setIdField] = useState('');
    const [idDesc, setIdDesc] = useState('');

    const [passwordLabel, setPasswordLabel] = useState('Password');
    const [password, setPassword] = useState('');
    const [passwordDesc, setPasswordDesc] = useState('');

    const [description, setDescription] = useState('');
    const [customFields, setCustomFields] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setName(editingItem.name || '');
            setIdLabel(editingItem.decrypted?.idLabel || 'ID');
            setIdField(editingItem.decrypted?.id || '');
            setIdDesc(editingItem.decrypted?.idDesc || '');

            setPasswordLabel(editingItem.decrypted?.passwordLabel || 'Password');
            setPassword(editingItem.decrypted?.password || '');
            setPasswordDesc(editingItem.decrypted?.passwordDesc || '');

            setDescription(editingItem.decrypted?.description || '');
            setCustomFields(
                Array.isArray(editingItem.decrypted?.customFields)
                    ? editingItem.decrypted.customFields
                    : []
            );
        } else {
            setName('');
            setIdLabel('ID');
            setIdField('');
            setIdDesc('');
            setPasswordLabel('Password');
            setPassword('');
            setPasswordDesc('');
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
            { id: Date.now().toString(), label: '', value: '', description: '' }
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
            .filter(f => (f.label && f.label.trim()) || (f.value && f.value.trim()) || (f.description && f.description.trim()))
            .map(f => ({
                id: f.id || Date.now().toString(),
                label: (f.label && f.label.trim()) || "Field",
                value: f.value || "", // keep case-sensitive
                description: (f.description && f.description.trim()) || ""
            }));

        setIsSubmitting(true);
        try {
            await onSave({
                name: name.trim(),
                idLabel: idLabel.trim() || "ID",
                id: idField, // exact case-sensitive
                idDesc: idDesc.trim(),
                passwordLabel: passwordLabel.trim() || "Password",
                password: password, // exact case-sensitive
                passwordDesc: passwordDesc.trim(),
                description: description.trim(),
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

    return (
        <Modalbox open={isOpen} onClose={onClose}>
            <div className="w-[92vw] sm:w-[540px] max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form 
                    onSubmit={handleSubmit} 
                    autoComplete="off" 
                    autoCorrect="off" 
                    autoCapitalize="off" 
                    spellCheck="false"
                    data-lpignore="true" 
                    data-form-type="other"
                    className="p-6 space-y-4 overflow-y-auto flex-1"
                >
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
                                name="vault_item_service_title"
                                autoComplete="off"
                                data-lpignore="true"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Google Account, Bank Login, AWS"
                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                            />
                        </div>
                    </div>

                    {/* 2. ID / Username Field with Editable Label, Value & Optional Field Description */}
                    <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="w-full sm:w-2/5">
                                <input
                                    type="text"
                                    name="vault_id_label_field"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={idLabel}
                                    onChange={(e) => setIdLabel(e.target.value)}
                                    placeholder="Field Name (e.g., ID / Email)"
                                    className="w-full px-2.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            </div>
                            <div className="relative flex-1 flex items-center">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    name="vault_credential_id_val"
                                    autoComplete="new-password"
                                    data-lpignore="true"
                                    data-form-type="other"
                                    value={idField}
                                    onChange={(e) => setIdField(e.target.value)}
                                    placeholder="Value (e.g. username, user@email.com)"
                                    className="w-full pl-9 pr-11 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                />
                                {idField && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(idField, idLabel || "ID")}
                                        title="Copy Value"
                                        className="absolute right-2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {copiedField === (idLabel || "ID") ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        <input
                            type="text"
                            name="vault_id_desc_field"
                            autoComplete="off"
                            data-lpignore="true"
                            value={idDesc}
                            onChange={(e) => setIdDesc(e.target.value)}
                            placeholder="Optional description/notes for this field (e.g. Primary admin email)"
                            className="w-full px-3 py-1.5 text-[11px] bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                        />
                    </div>

                    {/* 3. Password Field with Editable Label, Value, Visibility Toggle & Optional Description */}
                    <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="w-full sm:w-2/5">
                                <input
                                    type="text"
                                    name="vault_pass_label_field"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={passwordLabel}
                                    onChange={(e) => setPasswordLabel(e.target.value)}
                                    placeholder="Field Name (e.g., Password / Secret)"
                                    className="w-full px-2.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            </div>
                            <div className="relative flex-1 flex items-center">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <KeyRound className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="vault_credential_pass_val"
                                    autoComplete="new-password"
                                    data-lpignore="true"
                                    data-form-type="other"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Value (Case-Sensitive password)"
                                    className="w-full pl-9 pr-16 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                />
                                <div className="absolute right-1.5 flex items-center gap-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Hide password" : "Show password"}
                                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                    {password && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(password, passwordLabel || "Password")}
                                            title="Copy Value"
                                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                        >
                                            {copiedField === (passwordLabel || "Password") ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <input
                            type="text"
                            name="vault_pass_desc_field"
                            autoComplete="off"
                            data-lpignore="true"
                            value={passwordDesc}
                            onChange={(e) => setPasswordDesc(e.target.value)}
                            placeholder="Optional description/notes for this field (e.g. Master key / 90-day expiry)"
                            className="w-full px-3 py-1.5 text-[11px] bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                        />
                    </div>

                    {/* 4. Dynamic Custom Fields Section with Field Name, Value, and Optional Description */}
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
                            <div className="space-y-2.5">
                                {customFields.map((field, idx) => (
                                    <div
                                        key={field.id || idx}
                                        className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <input
                                                type="text"
                                                name={`custom_field_label_${idx}`}
                                                autoComplete="off"
                                                data-lpignore="true"
                                                value={field.label}
                                                onChange={(e) => handleUpdateCustomField(idx, 'label', e.target.value)}
                                                placeholder="Field Name (e.g. PIN, Secret, Account ID)"
                                                className="w-full sm:w-2/5 px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <div className="flex items-center gap-1.5 flex-1">
                                                <div className="relative flex-1 flex items-center">
                                                    <input
                                                        type="text"
                                                        name={`custom_field_val_${idx}`}
                                                        autoComplete="new-password"
                                                        data-lpignore="true"
                                                        data-form-type="other"
                                                        value={field.value}
                                                        onChange={(e) => handleUpdateCustomField(idx, 'value', e.target.value)}
                                                        placeholder="Value"
                                                        className="w-full pl-2.5 pr-8 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                    {field.value && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(field.value, field.label || `Field ${idx + 1}`)}
                                                            title="Copy Value"
                                                            className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            name={`custom_field_desc_${idx}`}
                                            autoComplete="off"
                                            data-lpignore="true"
                                            value={field.description || ''}
                                            onChange={(e) => handleUpdateCustomField(idx, 'description', e.target.value)}
                                            placeholder="Optional description/notes for this custom field"
                                            className="w-full px-3 py-1.5 text-[11px] bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 5. Overall Description / Notes Field (Optional) */}
                    <div className="space-y-1.5 pt-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Overall Credential Notes <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                <AlignLeft className="w-4 h-4" />
                            </span>
                            <textarea
                                rows="2"
                                name="vault_overall_description"
                                autoComplete="off"
                                data-lpignore="true"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Security questions, recovery codes, or general notes..."
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
            </div>
        </Modalbox>
    );
};

export default VaultItemModal;
