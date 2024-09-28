import React, { useEffect, useState } from 'react'
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
import { IoMdCloudUpload } from "react-icons/io";


const Photo = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    const defaultprofile = "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png"
    useEffect(() => {
        dispatch(header("Profile Update"))
    }, [])
    const WIDTH = 200;
    const [isfile, setisfile] = useState(false);
    const [disable, setdisable] = useState(false);
    let newimage;

    const common = (event) => {
        let image_file = event.target.files[0] || event;

        let name = Date.now() + image_file.name;
        // console.log(name);
        let reader = new FileReader
        reader.readAsDataURL(image_file)
        reader.onload = async (event) => {
            let image_url = event.target.result
            let image = document.createElement('img');
            image.src = image_url;
            // document.querySelector("#wrapper").appendChild(image)
            image.onload = async (e) => {
                let canvas = document.createElement("canvas")
                let ratio = WIDTH / e.target.width
                canvas.width = WIDTH
                canvas.height = e.target.height * ratio
                //    console.log(canvas.height)
                const context = canvas.getContext("2d")
                context.drawImage(image, 0, 0, canvas.width, canvas.height)

                let new_image_url = context.canvas.toDataURL("image/jpeg", 100)

                let new_image = document.createElement("img");

                newimage = urlToFile(new_image_url, name);
                new_image.src = new_image_url
                document.querySelector("#wrapper").innerHTML = "";
                document.querySelector("#wrapper").appendChild(new_image);
                setisfile(true);
            }
        }
    }

    const hi = async (event) => {
        common(event);
    }


    const sub = async (event) => {
        document.body.style.cursor = 'wait';
        const token = localStorage.getItem("token");
        setisfile(false);
        let image_file = document.getElementById('dfe').files[0];
        let name = Date.now() + image_file.name;
        // console.log(name);
        let reader = new FileReader
        reader.readAsDataURL(image_file)
        reader.onload = async (event) => {
            let image_url = event.target.result
            let image = document.createElement('img');
            image.src = image_url;
            image.onload = async (e) => {
                let canvas = document.createElement("canvas")
                let ratio = WIDTH / e.target.width
                canvas.width = WIDTH
                canvas.height = e.target.height * ratio
                const context = canvas.getContext("2d")
                context.drawImage(image, 0, 0, canvas.width, canvas.height)

                let new_image_url = context.canvas.toDataURL("image/jpeg", 100)

                let new_image = document.createElement("img");

                newimage = urlToFile(new_image_url, name);
                new_image.src = new_image_url

                let data = new FormData();
                data.append('image', newimage)
                data.append('oldimage', useralldetail.profilepic)
                // console.log(newimage);
                const id = toast.loading("Please wait...")
                try {
                    const rese = await fetch(`${import.meta.env.VITE_API_ADDRESS}photo`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                        body: data
                    })
                    const resuke = await rese.json();
                    setisfile(true);
                    console.log(resuke);
                    if (rese.ok) {
                        document.body.style.cursor = 'default';
                        sethide(!hide)
                        reset();
                        setisuploading(false);
                        dispatch(profilepicupdtae(resuke.url))
                        // toast.success("Photo Updated Successfully", { autoClose: 1300 });
                        toast.update(id, { render: "Photo Updated Successfully", type: "success", isLoading: false, autoClose: 1300 });
                        // <Navigate to='/' />
                    }
                } catch (error) {
                    console.log(error);
                    toast.warn("Error Occured", 1500);
                }
            }
        }
    }

    const urlToFile = (url, naam) => {
        let arr = url.split(",");
        let mime = arr[0].match(/:(.*?);/)[1]
        let data = arr[1]
        // console.log(mime)
        // console.log(data)
        let dataStr = atob(data)
        let n = dataStr.length
        let dataArr = new Uint8Array(n)

        while (n--) {
            dataArr[n] = dataStr.charCodeAt(n)
        }
        let file = new File([dataArr], naam, { type: mime })
        // console.log(file);
        return file;
    }
    const xdfvf = {
        background: "rgb(0, 204, 255)",
        color: "white"
    }
    const dfvfdv = {
        background: "grey",
        color: "black",
        opacity: 0.4,
    }
    const reset = () => {
        document.querySelector("#wrapper").innerHTML = "";
        document.querySelector("input").value = "";
        setisfile(false);
        // console.log(newimage)
    }
    const init = {
        name: "",
        phone: "",
        email: ""
    }
    const [input, setinput] = useState(init);

    const [sdfdf, wefwe] = useState(true);
    if (sdfdf && useralldetail.user) {
        setinput({
            ...input,
            name: useralldetail.user.name,
            phone: useralldetail.user.phone,
            email: useralldetail.user.email
        })
        wefwe(false);
    }


    const updatedetails = async () => {
        const { name, phone } = input;
        const token = localStorage.getItem("token");
        const toastId = toast.loading("Please wait...");
        // console.log(name,phone,email);
        setdisable(true);
        try {
            const query = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateuserdetail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name, phone
                })
            })
            const result = await query.json();
            if (query.ok) {
                // console.log(result);
                dispatch(profiledetailupdtae(input))
            }
            toast.update(toastId, { render: 'Updated Successfull', type: "success", isLoading: false, autoClose: 1600 });
            seteditable(!editable);
            setdisable(false)
        } catch (error) {
            toast.warn("Something went wrong", { autoClose: 1500 });
            console.log(error);
            setdisable(false)
            seteditable(!editable);
            toast.update(toastId, { render: error.message, type: "warning", isLoading: false, autoClose: 2600 });
        }
    }
    const [isuploading, setisuploading] = useState(false);
    const [hide, sethide] = useState(true);
    const [editable, seteditable] = useState(true);
    const [messagesent, setmessagesent] = useState()
    const hello = () => {
        sethide(!hide);
    }
    const handle = (e) => {
        let name = e.target.name;
        let val = e.target.value;
        setinput({
            ...input, [name]: val
        })
    }

    const resetpassword = async () => {
        const id = toast.loading("Please wait...")
        setdisable(true)
        try {
            // setisloadinge(true)
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}passreset`, {
                method: "Get",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            const data = await res.json();
            // console.log(data);
            // setisloadinge(false)

            if (!res.ok) {
                setdisable(false)
                return toast.update(id, { render: data.message, type: "warn", isLoading: false, autoClose: 2100 });
            }
            setdisable(false)
            setmessagesent(data.extramessage)
            toast.update(id, { render: data.message, type: "success", isLoading: false, autoClose: 2100 });
        } catch (error) {
            toast.update(id, { render: error.message, type: "warn", isLoading: false, autoClose: 2200 });
            // setisloadinge(false)
            console.log(error);
            setdisable(false)
        }
    }
    return (
        <>
            <div className="photo">
                <div className="profile">
                    <h2>User Profile Detail</h2>
                    <i>
                        <FaPencil style={{ fontSize: '12px' }} title='Edit Details' onClick={() => seteditable(!editable)} />
                    </i>
                    <div className='upper'>
                        <div className="profile-header">
                            <img src={useralldetail.profilepic ? useralldetail.profilepic : defaultprofile} alt="User Avatar" />
                            <br />  <button onClick={hello}>Update profile</button> <br />
                        </div>
                        <div className="profile-bio">

                            <TextField id="name" size='small' fullWidth label="Name" InputProps={{ readOnly: editable, }} variant="outlined" onChange={handle} name="name" defaultValue={input.name} />

                            <TextField id="phone" size='small' label="Phone" fullWidth InputProps={{ readOnly: editable, }} inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }} variant="outlined" onChange={handle} type="tel" name="phone" defaultValue={input.phone} />

                            <TextField id="email" size='small' label="Email" fullWidth InputProps={{ readOnly: editable, }} variant="outlined" onChange={handle} type="email" name="email" defaultValue={input.email} />


                            {!editable && <div>  <Button fullWidth disabled={disable} variant='contained' onClick={updatedetails}>Update Deatils</Button> </div>}
                            <Button disabled={disable} onClick={resetpassword} title='Password Reset' variant="contained" className='splbtn' startIcon={<TbMoodSad />}>
                                Send Password Reset Link
                            </Button>
                            {messagesent && <span style={{ fontSize: '12px', color: 'green' }}>{messagesent}</span>}

                        </div>

                    </div>
                    <div className={hide ? "lower hide" : "lower"}>
                        <input type="file" accept="image/*" onChange={hi} name="" id="dfe" />
                        <label htmlFor="dfe">Choose File</label>
                        <div id="wrapper">  </div>
                        <div id='btn'>
                            <button disabled={!isfile} onClick={sub} className={isfile ? null : "disabled"} >
                            <IoMdCloudUpload/> Upload</button>
                            {isfile ? <button onClick={reset} style={isfile ? xdfvf : dfvfdv}  >
                                <CgUndo /> Clear</button> : null}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Photo