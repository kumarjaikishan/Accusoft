import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, Unlock, KeyRound, Shield, ShieldCheck, Eye, EyeOff, 
    Copy, Check, Plus, Search, Trash2, Edit3, RefreshCw, 
    AlertCircle, HelpCircle, FileText, ChevronRight, User, Globe, AlertTriangle,
    LayoutGrid, List
} from 'lucide-react';
import { toast } from 'sonner';
import { 
    generateSalt, 
    deriveMasterKey, 
    createVerificationToken, 
    verifyMasterKey, 
    encryptCredential, 
    decryptCredential, 
    calculatePasswordStrength 
} from '../../../utils/cryptoVault';
import VaultItemModal from './VaultItemModal';
import Modalbox from '../../../components/custommodal/Modalbox';

const API_BASE = (import.meta.env.VITE_API_ADDRESS || "http://localhost:5000/api/").replace(/\/+$/, "");

const Vault = () => {
    // ---------- STATE ----------
    const [isLoadingMeta, setIsLoadingMeta] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [vaultMeta, setVaultMeta] = useState(null);

    // Crypto & Lock State
    const [masterKey, setMasterKey] = useState(null); // Held in React memory only!
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockPassword, setUnlockPassword] = useState('');
    const [showUnlockPassword, setShowUnlockPassword] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [shakeUnlock, setShakeUnlock] = useState(false);

    // Setup State (for first time user)
    const [setupPassword, setSetupPassword] = useState('');
    const [setupConfirm, setSetupConfirm] = useState('');
    const [setupHint, setSetupHint] = useState('');
    const [isSettingUp, setIsSettingUp] = useState(false);

    // Vault Data
    const [rawItems, setRawItems] = useState([]);
    const [decryptedItems, setDecryptedItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Item Visibility & Copy Feedback
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [copiedMap, setCopiedMap] = useState({});
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('vault_view_mode') || 'list';
    });

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('vault_view_mode', mode);
    };

    // Modals
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

    const token = localStorage.getItem("token");

    // ---------- API CALLS ----------

    const getAuthHeaders = useCallback(() => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }), [token]);

    // Fetch Vault Metadata
    const fetchVaultMeta = useCallback(async () => {
        setIsLoadingMeta(true);
        try {
            const res = await fetch(`${API_BASE}/admin/vault/meta`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok) {
                setIsInitialized(data.isInitialized);
                setVaultMeta(data);
            } else {
                toast.error(data.message || "Failed to load vault status.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error connecting to server.");
        } finally {
            setIsLoadingMeta(false);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        fetchVaultMeta();
    }, [fetchVaultMeta]);

    // Fetch and Decrypt Vault Items
    const fetchAndDecryptItems = useCallback(async (key) => {
        setIsLoadingItems(true);
        try {
            const res = await fetch(`${API_BASE}/admin/vault/items`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok) {
                setRawItems(data.items || []);
                
                // Decrypt all items locally in browser
                const decryptedList = await Promise.all(
                    (data.items || []).map(async (item) => {
                        const decrypted = await decryptCredential(item.encryptedData, item.iv, key);
                        return {
                            ...item,
                            decrypted: decrypted || { id: "", password: "", description: "" }
                        };
                    })
                );
                setDecryptedItems(decryptedList);
            } else {
                toast.error(data.message || "Failed to fetch credentials.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to decrypt vault records.");
        } finally {
            setIsLoadingItems(false);
        }
    }, [getAuthHeaders]);

    // ---------- VAULT SETUP ----------

    const handleSetupVault = async (e) => {
        e.preventDefault();
        if (setupPassword.length < 8) {
            toast.error("Master Password must be at least 8 characters long.");
            return;
        }
        if (setupPassword !== setupConfirm) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsSettingUp(true);
        try {
            const salt = generateSalt();
            const derivedKey = await deriveMasterKey(setupPassword, salt);
            const { checkCiphertext, checkIv } = await createVerificationToken(derivedKey);

            const res = await fetch(`${API_BASE}/admin/vault/init`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    salt,
                    checkCiphertext,
                    checkIv,
                    hint: setupHint.trim()
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Zero-Knowledge Vault initialized successfully!");
                setMasterKey(derivedKey);
                setIsUnlocked(true);
                setIsInitialized(true);
                setVaultMeta({ isInitialized: true, salt, checkCiphertext, checkIv, hint: setupHint });
                setDecryptedItems([]);
            } else {
                toast.error(data.message || "Setup failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to initialize cryptographic vault.");
        } finally {
            setIsSettingUp(false);
        }
    };

    // ---------- UNLOCK VAULT ----------

    const handleUnlockVault = async (e) => {
        e.preventDefault();
        if (!unlockPassword) return;

        setIsUnlocking(true);
        try {
            const derivedKey = await deriveMasterKey(unlockPassword, vaultMeta.salt);
            const isValid = await verifyMasterKey(derivedKey, vaultMeta.checkCiphertext, vaultMeta.checkIv);

            if (isValid) {
                setMasterKey(derivedKey);
                setIsUnlocked(true);
                setUnlockPassword('');
                toast.success("Vault unlocked successfully!");
                await fetchAndDecryptItems(derivedKey);
            } else {
                setShakeUnlock(true);
                setTimeout(() => setShakeUnlock(false), 500);
                toast.error("Incorrect Master Password! Decryption failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Cryptographic unlock error.");
        } finally {
            setIsUnlocking(false);
        }
    };

    // ---------- LOCK VAULT ----------

    const handleLockVault = () => {
        setMasterKey(null);
        setIsUnlocked(false);
        setDecryptedItems([]);
        setRawItems([]);
        setVisiblePasswords({});
        toast.info("Vault locked. Memory encryption keys cleared.");
    };

    // ---------- SAVE (CREATE / UPDATE) ITEM ----------

    const handleSaveItem = async (payload) => {
        if (!masterKey) {
            toast.error("Vault is locked!");
            return;
        }

        const sensitiveData = {
            name: payload.name,
            idLabel: payload.idLabel || 'ID / Username / Email',
            id: payload.id || '', // case-sensitive
            idDesc: payload.idDesc || '',
            passwordLabel: payload.passwordLabel || 'Password',
            password: payload.password || '', // case-sensitive
            passwordDesc: payload.passwordDesc || '',
            description: payload.description || '',
            customFields: payload.customFields || []
        };

        const { encryptedData, iv } = await encryptCredential(sensitiveData, masterKey);

        if (editingItem) {
            // Update
            const res = await fetch(`${API_BASE}/admin/vault/item/${editingItem._id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: payload.name,
                    encryptedData,
                    iv
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Credential updated securely!");
                await fetchAndDecryptItems(masterKey);
            } else {
                toast.error(data.message || "Failed to update item.");
            }
        } else {
            // Create
            const res = await fetch(`${API_BASE}/admin/vault/item`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: payload.name,
                    encryptedData,
                    iv
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Credential encrypted & saved!");
                await fetchAndDecryptItems(masterKey);
            } else {
                toast.error(data.message || "Failed to create item.");
            }
        }
    };

    // ---------- DELETE ITEM ----------

    const handleDeleteItem = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/vault/item/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Credential deleted permanently.");
                setDecryptedItems(prev => prev.filter(item => item._id !== id));
                setDeleteConfirmItem(null);
            } else {
                toast.error(data.message || "Failed to delete item.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting item.");
        }
    };

    // ---------- COPY TO CLIPBOARD ----------

    const handleCopy = (text, fieldKey, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedMap(prev => ({ ...prev, [fieldKey]: true }));
        toast.success(`${label} copied to clipboard!`);
        setTimeout(() => {
            setCopiedMap(prev => ({ ...prev, [fieldKey]: false }));
        }, 2000);
    };

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openGeneratorForModal = (callback) => {
        setGenCallback(() => callback);
        setIsGenModalOpen(true);
    };

    // Filter Items by Search
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return decryptedItems;
        const q = searchQuery.toLowerCase();
        return decryptedItems.filter(item => 
            item.name?.toLowerCase().includes(q) ||
            item.decrypted?.id?.toLowerCase().includes(q) ||
            item.decrypted?.description?.toLowerCase().includes(q) ||
            item.decrypted?.customFields?.some(f => 
                f.label?.toLowerCase().includes(q) || 
                f.value?.toLowerCase().includes(q)
            )
        );
    }, [decryptedItems, searchQuery]);

    const setupStrength = calculatePasswordStrength(setupPassword);

    // ==========================================
    // RENDER: LOADING STATE
    // ==========================================
    if (isLoadingMeta) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Secure Vault...</p>
            </div>
        );
    }

    // ==========================================
    // RENDER: 1. SETUP MASTER PASSWORD SCREEN
    // ==========================================
    if (!isInitialized) {
        return (
            <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Setup Your Master Password</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                        Create a Master Password for your Zero-Knowledge Vault. All your IDs and passwords will be encrypted locally using AES-256-GCM.
                    </p>
                </div>

                <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                        <strong>Important:</strong> We never store your Master Password on the server. If you forget it, your encrypted credentials cannot be recovered!
                    </span>
                </div>

                <form onSubmit={handleSetupVault} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Master Password <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={setupPassword}
                            onChange={(e) => setSetupPassword(e.target.value)}
                            placeholder="Enter strong master password"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100"
                        />
                        {setupPassword && (
                            <div className="mt-2 space-y-1">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-500">Strength:</span>
                                    <span className={`font-semibold ${setupStrength.color}`}>{setupStrength.label}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 h-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`rounded-full transition-all duration-300 ${
                                                setupStrength.score >= step ? setupStrength.bg : 'bg-slate-200 dark:bg-slate-800'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Confirm Master Password <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={setupConfirm}
                            onChange={(e) => setSetupConfirm(e.target.value)}
                            placeholder="Re-enter master password"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Password Hint <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={setupHint}
                            onChange={(e) => setSetupHint(e.target.value)}
                            placeholder="e.g. Favorite book + graduation year"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSettingUp}
                        className="w-full mt-2 py-3 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        {isSettingUp ? "Initializing Crypto Keys..." : "Create & Initialize Vault"}
                    </button>
                </form>
            </div>
        );
    }

    // ==========================================
    // RENDER: 2. LOCKED VAULT SCREEN
    // ==========================================
    if (!isUnlocked) {
        return (
            <div className="max-w-md mx-auto my-14 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
                <motion.div
                    animate={shakeUnlock ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
                            <Lock className="w-9 h-9" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Password Vault is Locked</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Enter your Master Password to decrypt your stored credentials.
                        </p>
                    </div>

                    <form 
                        onSubmit={handleUnlockVault} 
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                        className="space-y-4"
                    >
                        <div className="relative flex items-center">
                            <input
                                type={showUnlockPassword ? "text" : "password"}
                                required
                                autoFocus
                                name="vault_master_key_unlock"
                                autoComplete="new-password"
                                data-lpignore="true"
                                data-form-type="other"
                                value={unlockPassword}
                                onChange={(e) => setUnlockPassword(e.target.value)}
                                placeholder="Enter Master Password"
                                className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                {showUnlockPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {vaultMeta?.hint && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-1">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Hint: <strong className="text-slate-700 dark:text-slate-300">{vaultMeta.hint}</strong></span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isUnlocking}
                            className="w-full py-3 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Unlock className="w-4 h-4" />
                            {isUnlocking ? "Decrypting..." : "Unlock Vault"}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // ==========================================
    // RENDER: 3. UNLOCKED DASHBOARD
    // ==========================================
    return (
        <div className="w-full p-[10px] space-y-4 pb-16">
            {/* Header / Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Secure Password Vault</h1>
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            E2EE Active
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Zero-Knowledge client-side encrypted credentials with case-sensitive copy & privacy masking.
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-2.5">
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setIsItemModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Credential
                    </button>

                    <button
                        onClick={handleLockVault}
                        title="Lock Vault & Wipe RAM Key"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                        <Lock className="w-3.5 h-3.5" />
                        Lock Vault
                    </button>
                </div>
            </div>

            {/* Search Bar & View Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Name, ID, or notes..."
                        className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-2xs"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* View Switcher: Grid vs Row */}
                    <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner">
                        <button
                            type="button"
                            onClick={() => handleViewModeChange('grid')}
                            title="Grid View"
                            className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Grid</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleViewModeChange('list')}
                            title="Row / List View"
                            className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" />
                            <span>Row</span>
                        </button>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 shadow-2xs">
                        Total Saved: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{decryptedItems.length}</strong>
                    </div>
                </div>
            </div>

            {/* Credentials Grid / List */}
            {isLoadingItems ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                    <p className="text-xs text-slate-500">Decrypting credentials in memory...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-center">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {searchQuery ? "No matching credentials found" : "No credentials in vault yet"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                        {searchQuery ? "Try a different search term." : "Click 'Add Credential' to securely store your first login, ID, and password."}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setIsItemModalOpen(true);
                            }}
                            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add First Credential
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* ================= GRID VIEW ================= */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
                    {filteredItems.map((item) => {
                        const isPassVisible = visiblePasswords[item._id];
                        const idKey = `id-${item._id}`;
                        const passKey = `pass-${item._id}`;
                        const isIdCopied = copiedMap[idKey];
                        const isPassCopied = copiedMap[passKey];

                        return (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3.5">
                                    {/* Card Header: Name & Actions */}
                                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                                                {item.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setIsItemModalOpen(true);
                                                }}
                                                title="Edit Credential"
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmItem(item)}
                                                title="Delete Credential"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* ID / Username Field */}
                                    {item.decrypted?.id && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    {item.decrypted?.idLabel || "ID / Username"}
                                                </span>
                                                {item.decrypted?.idDesc && (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        {item.decrypted.idDesc}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate select-all pr-2">
                                                    {item.decrypted.id}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(item.decrypted.id, idKey, item.decrypted?.idLabel || "ID / Username")}
                                                    title="Copy ID"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {isIdCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Field (Masked by default) */}
                                    {item.decrypted?.password && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    {item.decrypted?.passwordLabel || "Password"}
                                                </span>
                                                {item.decrypted?.passwordDesc && (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        {item.decrypted.passwordDesc}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate select-all pr-2">
                                                    {isPassVisible ? item.decrypted.password : "••••••••••••"}
                                                </span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => togglePasswordVisibility(item._id)}
                                                        title={isPassVisible ? "Hide password" : "Show password"}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    >
                                                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item.decrypted.password, passKey, item.decrypted?.passwordLabel || "Password")}
                                                        title="Copy Password"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    >
                                                        {isPassCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dynamic Custom Fields */}
                                    {Array.isArray(item.decrypted?.customFields) && item.decrypted.customFields.length > 0 && (
                                        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                            {item.decrypted.customFields.map((field, fIdx) => {
                                                const fieldKey = `custom-${item._id}-${fIdx}`;
                                                const isFieldCopied = copiedMap[fieldKey];
                                                return (
                                                    <div key={field.id || fIdx} className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                                {field.label || "Field"}
                                                            </span>
                                                            {field.description && (
                                                                <span className="text-[10px] text-slate-400 italic">
                                                                    {field.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                                            <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate select-all pr-2">
                                                                {field.value}
                                                            </span>
                                                            {field.value && (
                                                                <button
                                                                    onClick={() => handleCopy(field.value, fieldKey, field.label || "Field")}
                                                                    title={`Copy ${field.label || "Value"}`}
                                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                                                                >
                                                                    {isFieldCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Optional Description / Memo */}
                                    {item.decrypted?.description && (
                                        <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded-lg border border-slate-100 dark:border-slate-800/40 line-clamp-2">
                                            {item.decrypted.description}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                /* ================= ROW / LIST VIEW ================= */
                <div className="space-y-3">
                    {filteredItems.map((item) => {
                        const isPassVisible = visiblePasswords[item._id];
                        const idKey = `id-${item._id}`;
                        const passKey = `pass-${item._id}`;
                        const isIdCopied = copiedMap[idKey];
                        const isPassCopied = copiedMap[passKey];

                        return (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                            >
                                {/* Left: Name & Note */}
                                <div className="flex items-center gap-3 lg:w-1/4 min-w-0">
                                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                                            {item.name}
                                        </h3>
                                        {item.decrypted?.description && (
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                                                {item.decrypted.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Middle: ID, Password & Custom Fields */}
                                <div className="flex flex-wrap items-center gap-3 flex-1">
                                    {/* ID / Username */}
                                    {item.decrypted?.id && (
                                        <div className="flex flex-col gap-1 min-w-[150px] max-w-xs">
                                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[80px]">
                                                    {item.decrypted?.idLabel || "ID"}
                                                </span>
                                                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate select-all">
                                                    {item.decrypted.id}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(item.decrypted.id, idKey, item.decrypted?.idLabel || "ID / Username")}
                                                    title="Copy ID"
                                                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {isIdCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                            {item.decrypted?.idDesc && (
                                                <div className="flex items-center gap-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                    <span className="truncate">{item.decrypted.idDesc}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Password */}
                                    {item.decrypted?.password && (
                                        <div className="flex flex-col gap-1 min-w-[170px] max-w-xs">
                                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[80px]">
                                                    {item.decrypted?.passwordLabel || "PASS"}
                                                </span>
                                                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate select-all">
                                                    {isPassVisible ? item.decrypted.password : "••••••••••••"}
                                                </span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => togglePasswordVisibility(item._id)}
                                                        title={isPassVisible ? "Hide password" : "Show password"}
                                                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                                    >
                                                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item.decrypted.password, passKey, item.decrypted?.passwordLabel || "Password")}
                                                        title="Copy Password"
                                                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                                    >
                                                        {isPassCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            {item.decrypted?.passwordDesc && (
                                                <div className="flex items-center gap-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                    <span className="truncate">{item.decrypted.passwordDesc}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Custom Fields in Row View */}
                                    {Array.isArray(item.decrypted?.customFields) && item.decrypted.customFields.map((field, fIdx) => {
                                        const fieldKey = `custom-${item._id}-${fIdx}`;
                                        const isFieldCopied = copiedMap[fieldKey];
                                        return (
                                            <div key={field.id || fIdx} className="flex flex-col gap-1 min-w-[140px] max-w-xs">
                                                <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[80px]">
                                                        {field.label}:
                                                    </span>
                                                    <span className="font-mono text-slate-700 dark:text-slate-200 truncate select-all">
                                                        {field.value}
                                                    </span>
                                                    {field.value && (
                                                        <button
                                                            onClick={() => handleCopy(field.value, fieldKey, field.label || "Field")}
                                                            title={`Copy ${field.label || "Value"}`}
                                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
                                                        >
                                                            {isFieldCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    )}
                                                </div>
                                                {field.description && (
                                                    <div className="flex items-center gap-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                        <span className="truncate">{field.description}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0 self-end lg:self-auto border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setIsItemModalOpen(true);
                                        }}
                                        title="Edit Credential"
                                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmItem(item)}
                                        title="Delete Credential"
                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Credential Create/Edit Modal */}
            <VaultItemModal
                isOpen={isItemModalOpen}
                onClose={() => {
                    setIsItemModalOpen(false);
                    setEditingItem(null);
                }}
                onSave={handleSaveItem}
                editingItem={editingItem}
            />

            {/* Delete Confirmation Modal */}
            <Modalbox open={Boolean(deleteConfirmItem)} onClose={() => setDeleteConfirmItem(null)}>
                <div className="w-[90vw] sm:w-[380px] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                        <div className="p-2 rounded-xl bg-rose-500/10">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold">Delete Credential?</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                        Are you sure you want to permanently delete <strong>{deleteConfirmItem?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            onClick={() => setDeleteConfirmItem(null)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDeleteItem(deleteConfirmItem?._id)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                        >
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </Modalbox>
        </div>
    );
};

export default Vault;
