import React, { useEffect, useState } from 'react';
import { Frown, Undo, Pencil, CloudUpload } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { header } from '../store/login';
import { profilepicupdtae, profiledetailupdtae } from '../store/api';
import { toast } from 'react-toastify';

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
    const maxWidth = 350;
    const [input, setInput] = useState({
        name: useralldetail.user?.name || "",
        phone: useralldetail.user?.phone || "",
        email: useralldetail.user?.email || ""
    });
    const [messageSent, setMessageSent] = useState(null);
    const WIDTH = 250;

    useEffect(() => {
        dispatch(header("Profile Update"));
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
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
    };
    const reset = () => {
        document.querySelector("input").value = "";
        setIsFile(false);
        setWebpImage(null)
        // console.log(newimage)
    }

    const handleUpload = async () => {
        document.body.style.cursor = 'wait';
        const token = localStorage.getItem("token");
        const name = `${Date.now()}profilepic.webp`;
        const newImage = urlToFile(webpImage, name);
        const id = toast.loading("Please wait...");
        setIsFile(false);

        try {
            // Fetch the signed URL
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}getsignedurl`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ type: newImage.type, name }),
            });

            if (!res.ok) throw new Error("Failed to get signed URL.");
            const { url: postObjectUrl } = await res.json();

            // Upload the image to S3
            const uploadRes = await fetch(postObjectUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": newImage.type, // Set correct content type
                },
                body: newImage,
            });

            if (!uploadRes.ok) throw new Error("Failed to upload image.");

            // Update status
            const statusRes = await fetch(`${import.meta.env.VITE_API_ADDRESS}status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ imageurl: postObjectUrl.split('?')[0], oldurl: useralldetail.profilepic }),
            });

            if (!statusRes.ok) throw new Error("Failed to update status.");

            const statusMessage = await statusRes.json();
            setHide(!hide);
            reset();
            dispatch(profilepicupdtae(postObjectUrl.split('?')[0]));
            document.body.style.cursor = 'default';
            toast.update(id, { render: statusMessage.message, type: "success", isLoading: false, autoClose: 1600 });

        } catch (error) {
            setIsFile(true);
            console.log(error.message);
            toast.update(id, { render: error.message, type: "error", isLoading: false, autoClose: 1600 });
        }
    };

    const resetForm = () => {
        document.querySelector("#wrapper").innerHTML = "";
        document.querySelector("input").value = "";
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
                    onClick={() => seteditable(!editable)}
                >
                    <Pencil className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]" title='Edit Details' />
                </i>
                <div className="relative w-full sm:w-[96%] mx-auto p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col sm:flex-row justify-between mb-4 bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-center border-b sm:border-b-0 sm:border-r border-gray-300 dark:border-white/10 w-full sm:w-[35%] py-4 sm:py-6 mb-4 sm:mb-0 flex flex-col items-center justify-center">
                        <img className="w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] rounded-full object-cover shadow-md border-4 border-white dark:border-slate-800 mb-4" src={useralldetail.profilepic || defaultProfile} alt="User Avatar" />
                        <button onClick={() => setHide(!hide)} className="text-sm font-medium text-indigo-600 dark:text-cyan-400 hover:underline">Update Image</button>
                    </div>
                    <div className="w-full sm:w-[60%] flex flex-col justify-center gap-4 pt-4 sm:pt-0 pl-0 sm:pl-4">
                        <input type="text" placeholder="Name" name="name" readOnly={editable} value={input.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-gray-100 transition shadow-sm text-sm" />
                        <input type="tel" placeholder="Phone" name="phone" readOnly={editable} maxLength={10} value={input.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-gray-100 transition shadow-sm text-sm" />
                        <input type="email" placeholder="Email" name="email" readOnly={true} value={input.email} className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg outline-none bg-gray-100 dark:bg-slate-900/50 dark:text-gray-400 cursor-not-allowed shadow-sm text-sm" title="Email cannot be edited" />

                        {!editable && <button onClick={updateDetails} disabled={disable} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 mt-1">Update Details</button>}
                        <button onClick={resetPassword} disabled={disable} className="w-full border border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"><Frown className="text-lg" /> Send Password Reset Link</button>
                        {messageSent && <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{messageSent}</span>}
                    </div>
                </div>
                <div className={`flex justify-center items-center flex-col transition-all duration-500 py-4 ${hide ? "hidden" : "flex"}`}>
                    <input type="file" id='dfe' accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label className="w-[250px] h-[100px] rounded-xl flex flex-col justify-center items-center gap-2 border-2 border-dashed border-indigo-600 dark:border-cyan-400 font-medium text-indigo-600 dark:text-cyan-400 cursor-pointer bg-indigo-50 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-800 transition shadow-sm" htmlFor="dfe">
                        <CloudUpload className="text-2xl" />
                        <span>Select Image</span>
                    </label>
                    <div className="mt-4 overflow-x-auto w-full flex justify-center" id="wrapper">
                        {webpImage && <img className="rounded-xl border-2 border-dashed border-indigo-600 dark:border-cyan-400 shadow-md object-contain max-h-[200px]" src={webpImage} alt="Image format" />}
                    </div>
                    <div className="mt-4 flex gap-4 w-full justify-center" id="btn">
                        {isFile && <Button color='error' onClick={resetForm} disabled={!isFile} startIcon={<Undo />} variant="outlined">Undo</Button>}
                        <Button className={isFile ? "" : "opacity-40 grayscale pointer-events-none"} onClick={handleUpload} disabled={!isFile} startIcon={<CloudUpload />} variant="contained">Upload</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Photo;
