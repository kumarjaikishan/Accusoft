import React, { useEffect, useState, useRef } from 'react';
import { Frown, Undo, Pencil, Upload } from 'lucide-react';

import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { header } from '../store/login';
import { profilepicupdtae, profiledetailupdtae } from '../store/api';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

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
    const [isFile, setIsFile] = useState(false);
    const [disable, setDisable] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [hide, setHide] = useState(true);
    const [editable, seteditable] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0)
    const maxWidth = 250;
    const [input, setInput] = useState({
        name: useralldetail.user?.name || "",
        phone: useralldetail.user?.phone || "",
        email: useralldetail.user?.email || ""
    });
    const [messageSent, setMessageSent] = useState(null);
    const WIDTH = 250;

    useEffect(() => {
        dispatch(header("Profile Update"));
        // console.log(useralldetail.user.userType)
    }, []);

    const handleImageUpload1 = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(e.target.files[0])

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate aspect ratio and set custom max width while maintaining aspect ratio
                    const aspectRatio = img.height / img.width;
                    const newWidth = Math.min(img.width, maxWidth); // Ensure image does not exceed max width
                    const newHeight = newWidth * aspectRatio;

                    // Set canvas size to the new dimensions
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Draw the image on the canvas with new dimensions
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Convert the canvas content to WebP
                    const webpUrl = canvas.toDataURL('image/webp');

                    // Set the WebP image to state to display/download
                    setWebpImage(webpUrl);
                    setIsFile(true)
                    // console.log(webpUrl)
                };
            };
            reader.readAsDataURL(file); // Read file as Data URL
        }
    }

    const inputref = useRef(null);
    const reset = () => {
        document.querySelector("input").value = "";
        setIsFile(false);
        setWebpImage(null)
        setWebpImage(null)
        setSelectedFile(null)
    }

    const handleUpload1 = async () => {
        document.body.style.cursor = "wait";

        const token = localStorage.getItem("token");

        const name = Date.now() + "kishan.webp";
        const newimage = await urlToFile(webpImage, name);

        const data = new FormData();
        data.append("image", newimage);
        data.append("oldimage", useralldetail.profilepic);

        const id = toast.loading("Uploading... 0%");
        setIsFile(false);

        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${import.meta.env.VITE_API_ADDRESS}photo`, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        // ✅ Progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded * 100) / event.total);
                setProgress(percentage);

                toast.update(id, {
                    render: `Uploading... ${percentage}%`,
                    isLoading: true,
                });
            }
        };

        // ✅ Success / Error
        xhr.onload = () => {
            document.body.style.cursor = "default";
            setProgress(0);
            setIsFile(true);

            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);

                setHide(true);
                reset();

                dispatch(profilepicupdtae(response.url));

                toast.update(id, {
                    render: "Photo Updated Successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 1300,
                });
            } else {
                toast.update(id, {
                    render: "Upload Failed",
                    type: "error",
                    isLoading: false,
                    autoClose: 1500,
                });
            }
        };

        // ❌ Network error
        xhr.onerror = () => {
            document.body.style.cursor = "default";
            setProgress(0);
            setIsFile(true);

            toast.update(id, {
                render: "Network Error",
                type: "error",
                isLoading: false,
                autoClose: 1500,
            });
        };

        xhr.send(data);
    };

    const resetForm = () => {
        setProgress(0)
        setSelectedFile(null)
        setIsFile(false);
    };

    const updateDetails = async () => {
        const { name, phone } = input;
        const token = localStorage.getItem("token");
        const toastId = toast.loading("Updating details...");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateuserdetail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone })
            });
            const result = await response.json();
            if (response.ok) {
                dispatch(profiledetailupdtae(input));
                toast.update(toastId, { render: 'Updated Successfully', type: "success", isLoading: false, autoClose: 1600 });
                seteditable(!editable);
            }
        } catch (error) {
            toast.update(toastId, { render: error.message, type: "warning", isLoading: false, autoClose: 2600 });
        } finally {
            setDisable(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const resetPassword = async () => {
        const token = localStorage.getItem("token");
        const toastId = toast.loading("Sending reset link...");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}passreset`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            const data = await res.json();
            if (res.ok) {
                setMessageSent(data.extramessage);
                toast.update(toastId, { render: data.message, type: "success", isLoading: false, autoClose: 2100 });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 2200 });
        } finally {
            setDisable(false);
        }
    };

    return (
        <div className="w-full h-full items-start sm:items-center flex justify-center px-2 py-4 sm:py-8 text-gray-800 dark:text-gray-100">
            <div className="relative w-full max-w-[700px] mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none border border-transparent dark:border-white/5 flex flex-col mt-4">
                <h2 className="text-center font-bold tracking-wide sm:tracking-widest text-[#212529] dark:text-gray-100 text-xl sm:text-2xl mb-6">User Profile Detail</h2>
                <i
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] shadow-md flex justify-center items-center rounded-full bg-indigo-600 text-white cursor-pointer transition hover:scale-105 hover:bg-indigo-700 z-10"
                    onClick={() => useralldetail?.user?.userType == "demo" ? '' : seteditable(!editable)}
                >
                    <Pencil className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]" title='Edit Details' />
                </i>
                <div className="relative w-full sm:w-[96%] mx-auto p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col sm:flex-row justify-between mb-4 bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-center border-b sm:border-b-0 sm:border-r border-gray-300 dark:border-white/10 w-full sm:w-[35%] py-4 sm:py-6 mb-4 sm:mb-0 flex flex-col items-center justify-center">
                        <div className="w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] relative">
                            <img className="w-full h-full rounded-full object-cover shadow-md border-4 border-white dark:border-slate-800" src={useralldetail.profilepic || defaultProfile} alt="User Avatar" />
                            <span className="cursor-pointer absolute bottom-1 right-1 bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 border-2 border-dashed border-indigo-600 dark:border-cyan-400 font-bold rounded-full w-[35px] h-[35px] flex justify-center items-center hover:scale-110 transition shadow-sm" onClick={() => setHide(!hide)} title='Edit Profile Picture'>
                                <Pencil className="w-[12px] h-[12px] sm:w-[15px] sm:h-[15px]" />
                            </span>
                        </div>
                    </div>
                    <div className="w-full sm:w-[60%] flex flex-col justify-center gap-4 pt-4 sm:pt-0 pl-0 sm:pl-4">
                        <input type="text" placeholder="Name" name="name" readOnly={editable} value={input.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-gray-100 transition shadow-sm text-sm" />
                        <input type="tel" placeholder="Phone" name="phone" readOnly={editable} maxLength={10} value={input.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-gray-100 transition shadow-sm text-sm" />
                        <input type="email" placeholder="Email" name="email" readOnly={editable} value={input.email} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none bg-gray-100 dark:bg-slate-900/50 dark:text-gray-400 cursor-not-allowed shadow-sm text-sm" title="Email cannot be edited" />

                        {!editable && <button onClick={updateDetails} disabled={disable} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 mt-1">Update Details</button>}
                        <button onClick={resetPassword} disabled={disable || useralldetail?.user?.userType == "demo"} className="w-full border border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"><Frown className="text-lg" /> Send Password Reset Link</button>
                        {messageSent && <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{messageSent}</span>}
                    </div>
                </div>

                <div className={`flex justify-center items-center flex-col transition-all duration-500 py-4 ${hide ? "hidden" : "flex"}`}>
                    {!selectedFile &&
                        <div className="w-[250px] h-[100px] rounded-xl flex flex-col justify-center items-center gap-2 border-2 border-dashed border-indigo-600 dark:border-cyan-400 font-medium text-indigo-600 dark:text-cyan-400 cursor-pointer bg-indigo-50 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-800 transition shadow-sm" onClick={() => inputref.current.click()}>
                            <input type="file" onChange={handleImageUpload1} ref={inputref} accept="image/*" name="" id="fileInput" className="hidden" />
                            <Upload className="text-2xl" />
                            <span>Select Image</span>
                        </div>}
                    {selectedFile &&
                        <div className='flex justify-center items-center flex-col gap-4 mt-2'>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedFile.name}</span>
                            {webpImage && <img className=" border-2 border-dashed border-slate-600 dark:border-cyan-400 shadow-md object-cover h-50 w-50 rounded-full" src={webpImage} alt="selected Image" />}
                            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 dark:bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="mt-2 flex gap-4 w-full justify-center">
                                <Button color='error' onClick={resetForm} startIcon={<Undo />} variant="outlined">Reset</Button>
                                <Button onClick={handleUpload1} startIcon={<Upload />} variant="contained">Upload</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Photo;
