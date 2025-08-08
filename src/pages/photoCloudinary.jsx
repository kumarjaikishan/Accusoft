import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from "react-router-dom";
import './photo.css';
import { useSelector, useDispatch } from 'react-redux';
import { header } from '../store/login';
import { profilepicupdtae, profiledetailupdtae } from '../store/api';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { TbMoodSad } from "react-icons/tb";
import TextField from '@mui/material/TextField';
import { CgUndo } from "react-icons/cg";
import { FaPencil } from "react-icons/fa6";
import { BsUpload } from "react-icons/bs";
import axios from 'axios';

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

        document.body.style.cursor = 'wait';
        const token = localStorage.getItem("token");

        let name = Date.now() + 'kishan.webp';
        let newimage = await urlToFile(webpImage, name); // Ensure urlToFile returns a valid File object

        let data = new FormData();
        data.append('image', newimage);
        data.append('oldimage', useralldetail.profilepic);

        const id = toast.loading("Uploading... 0%");
        setIsFile(false);

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API_ADDRESS}photo`,
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        // console.log("uploading prcentage:",percentage)
                        setProgress(percentage);
                        toast.update(id, { render: "Uploading...", isLoading: true });
                    }
                }
            );
            console.log(response)
            document.body.style.cursor = 'default';
            setHide(true)
            reset();
            setIsFile(true);
            setProgress(0)
            dispatch(profilepicupdtae(response.data.url))
            toast.update(id, { render: "Photo Updated Successfully", type: "success", isLoading: false, autoClose: 1300 });

        } catch (error) {
            setIsFile(true);
            setProgress(0)
            console.log(error);
            toast.update(id, { render: "Error Occurred", type: "error", isLoading: false, autoClose: 1500 });
        }
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
        <div className="photopage">
            <div className="profile">
                <h2>User Profile Detail</h2>
                <i onClick={() => seteditable(!editable)}>
                    <FaPencil style={{ fontSize: '12px' }} title='Edit Details' />
                </i>
                <div className="upper">
                    <div className="profile-header">
                        <div className="img">
                            <img src={useralldetail.profilepic || defaultProfile} alt="User Avatar" />
                            <span onClick={() => setHide(!hide)} title='Edit Profile Picture'>
                                <FaPencil  style={{ fontSize: '12px' }}  />
                            </span>
                        </div>
                    </div>
                    <div className="profile-bio">
                        <TextField label="Name" name="name" fullWidth size="small" value={input.name} onChange={handleInputChange} InputProps={{ readOnly: editable }} />
                        <TextField label="Phone" name="phone" fullWidth size="small" value={input.phone} onChange={handleInputChange} InputProps={{ readOnly: editable }} inputProps={{ maxLength: 10, pattern: "[0-9]*" }} />
                        <TextField label="Email" name="email" fullWidth size="small" value={input.email} InputProps={{ readOnly: editable }} />

                        {!editable && <Button onClick={updateDetails} fullWidth disabled={disable} variant="contained">Update Details</Button>}
                        <Button onClick={resetPassword} disabled={disable} variant="contained" startIcon={<TbMoodSad />}>Send Password Reset Link</Button>
                        {messageSent && <span style={{ fontSize: '12px', color: 'green' }}>{messageSent}</span>}
                    </div>
                </div>

                <div className={hide ? "lower hide" : "lower"}>
                    {!selectedFile &&
                        <div className="chooseFile" onClick={() => inputref.current.click()}>
                            <input type="file" onChange={handleImageUpload1} ref={inputref} accept="image/*" name="" id="fileInput" />
                            <BsUpload />
                            Upload
                        </div>}
                    {selectedFile && <div className='imagedisplay'>
                        <span>{selectedFile.name}</span>
                        {webpImage && <img src={webpImage} alt="selected Image" />}
                        <div className="progressbg">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div>
                            <Button color='error' onClick={resetForm} startIcon={<CgUndo />} variant="outlined">Reset</Button>
                            <Button onClick={handleUpload1} startIcon={<BsUpload />} variant="contained">Upload</Button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default Photo;
