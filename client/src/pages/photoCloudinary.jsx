import React, { useEffect, useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Upload, 
  Check, 
  X, 
  KeyRound, 
  Edit3, 
  Save, 
  RefreshCw, 
  Shield, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { header } from '../store/login';
import { profilepicupdtae, profiledetailupdtae } from '../store/api';
import { toast } from '../utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import TextInput from '../components/common/TextInput';

// Helper function to convert image URL to File
const urlToFile = (url, filename) => {
  let arr = url.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const Photo = () => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  const defaultProfile = "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png";

  const [webpImage, setWebpImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const [input, setInput] = useState({
    name: useralldetail?.user?.name || "",
    phone: useralldetail?.user?.phone || "",
    email: useralldetail?.user?.email || ""
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(header("Profile"));
  }, [dispatch]);

  // Sync state if Redux loads after initial mount
  useEffect(() => {
    if (useralldetail?.user) {
      setInput({
        name: useralldetail.user.name || "",
        phone: useralldetail.user.phone || "",
        email: useralldetail.user.email || ""
      });
    }
  }, [useralldetail?.user]);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 300;
          const aspectRatio = img.height / img.width;
          const newWidth = Math.min(img.width, maxWidth);
          const newHeight = newWidth * aspectRatio;

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          const webpUrl = canvas.toDataURL('image/webp');
          setWebpImage(webpUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!webpImage) return;

    setIsUploading(true);
    const token = localStorage.getItem("token");
    const name = Date.now() + "_avatar.webp";
    const newimage = await urlToFile(webpImage, name);

    const data = new FormData();
    data.append("image", newimage);
    data.append("oldimage", useralldetail?.profilepic || "");

    const toastId = toast.loading("Uploading picture... 0%");
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${import.meta.env.VITE_API_ADDRESS}photo`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        setProgress(percentage);
        toast.update(toastId, {
          render: `Uploading picture... ${percentage}%`,
          isLoading: true,
        });
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setProgress(0);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        dispatch(profilepicupdtae(response.url));
        setShowPhotoModal(false);
        setWebpImage(null);
        setSelectedFile(null);

        toast.update(toastId, {
          render: "Profile picture updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(toastId, {
          render: "Failed to upload picture",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setProgress(0);
      toast.update(toastId, {
        render: "Network error occurred",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    };

    xhr.send(data);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Saving profile details...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateuserdetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: input.name, phone: input.phone })
      });
      const result = await response.json();
      if (response.ok) {
        dispatch(profiledetailupdtae(input));
        toast.update(toastId, { 
          render: result.message || 'Profile updated successfully!', 
          type: "success", 
          isLoading: false, 
          autoClose: 1600 
        });
        setIsEditing(false);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.update(toastId, { 
        render: error.message, 
        type: "warning", 
        isLoading: false, 
        autoClose: 2600 
      });
    } finally {
      setSavingDetails(false);
    }
  };

  const handleSendResetPassword = async () => {
    if (useralldetail?.user?.userType === "demo") {
      return toast.warn("Demo account password cannot be reset");
    }

    setSendingReset(true);
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Sending password reset link...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}passreset`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { 
          render: data.message || "Reset link sent to your email!", 
          type: "success", 
          isLoading: false, 
          autoClose: 2500 
        });
      } else {
        throw new Error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.update(toastId, { 
        render: error.message, 
        type: "error", 
        isLoading: false, 
        autoClose: 2500 
      });
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--navheight))] p-3 sm:p-6 lg:p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl flex flex-col gap-6">

        {/* 🌟 HERO PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
        >
          {/* Pure Tailwind Abstract Cover Banner with Overlapping Circles */}
          <div className="h-24 sm:h-32 w-full relative overflow-hidden bg-slate-900 flex items-start sm:items-center p-3.5 sm:p-5 select-none">
            {/* Base Deep Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900" />

            {/* Glowing Abstract Circle 1 (Top Left) */}
            <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
            <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full border border-indigo-400/20 pointer-events-none" />

            {/* Glowing Abstract Circle 2 (Bottom Right) */}
            <div className="absolute -bottom-14 -right-14 w-48 h-48 rounded-full bg-cyan-500/20 blur-xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full border border-cyan-400/20 pointer-events-none" />

            {/* Subtle Grid Dot Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* Banner Content */}
            <div className="relative z-10 flex items-center justify-end w-full text-white">
              {useralldetail?.user?.isadmin && (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md border border-indigo-400/30 text-[11px] sm:text-xs">
                  <Shield size={12} /> Administrator
                </span>
              )}
            </div>
          </div>

          {/* Profile Overview Row */}
          <div className="px-5 sm:px-8 pb-5 pt-0 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 relative z-20">
            {/* Avatar with Upload Trigger */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
                <img 
                  src={useralldetail?.profilepic || defaultProfile} 
                  alt={useralldetail?.user?.name || "Profile Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Photo Edit Bubble */}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white dark:ring-slate-900"
                title="Change Profile Picture"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">
                  {useralldetail?.user?.name || "Your Profile"}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {useralldetail?.user?.email}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  icon={Edit3}
                  size="sm"
                  disabled={useralldetail?.user?.userType === "demo"}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setInput({
                      name: useralldetail?.user?.name || "",
                      phone: useralldetail?.user?.phone || "",
                      email: useralldetail?.user?.email || ""
                    });
                  }}
                  icon={X}
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 📋 DETAILS & SECURITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PERSONAL DETAILS CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">Personal Information</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Manage your personal identification details</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <TextInput
                  label="Full Name"
                  id="profile-name"
                  name="name"
                  value={input.name}
                  onChange={(e) => setInput(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  startAdornment={<User size={16} />}
                  required
                />

                <TextInput
                  label="Phone Number"
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  value={input.phone}
                  onChange={(e) => setInput(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your mobile number"
                  startAdornment={<Phone size={16} />}
                  required
                />

                <TextInput
                  label="Email Address"
                  id="profile-email"
                  name="email"
                  value={input.email}
                  disabled={true}
                  startAdornment={<Mail size={16} />}
                  helperText="Registered email address cannot be changed"
                />

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      loading={savingDetails}
                      icon={Save}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          {/* SECURITY & AUTHENTICATION CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">Security</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Account login & credentials</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield size={14} className="text-indigo-500" /> Password Recovery
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                    Need to change or recover your password? Click below to receive a secure reset link in your inbox.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="outline"
                onClick={handleSendResetPassword}
                loading={sendingReset}
                disabled={sendingReset || useralldetail?.user?.userType === "demo"}
                icon={KeyRound}
                className="w-full justify-center"
              >
                Send Reset Password Link
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 📷 UPLOAD AVATAR MODAL */}
        <AnimatePresence>
          {showPhotoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera size={18} />
                    <h2 className="font-bold text-base">Update Profile Picture</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhotoModal(false);
                      setWebpImage(null);
                      setSelectedFile(null);
                    }}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 flex flex-col items-center gap-5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  {!webpImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition group"
                    >
                      <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
                        <ImageIcon size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                          Click to select an image
                        </p>
                        <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-indigo-500 shadow-lg relative">
                        <img src={webpImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 truncate max-w-xs">
                        {selectedFile?.name}
                      </span>

                      {/* Progress Bar */}
                      {isUploading && (
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 w-full mt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setWebpImage(null);
                            setSelectedFile(null);
                          }}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          Change
                        </Button>
                        <Button
                          onClick={handleUploadPhoto}
                          loading={isUploading}
                          icon={Upload}
                          className="flex-1"
                        >
                          Save Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Photo;
