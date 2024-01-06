import React, { useEffect, useState } from 'react'
import { Navigate } from "react-router-dom";
import './photo.css';
import { useSelector, useDispatch } from 'react-redux';
import { header } from '../store/login';
import { profilepicupdtae, profiledetailupdtae } from '../store/api';


const Photo = () => {
    const dispatch = useDispatch();
    const log = useSelector((state) => state.login);
    if (!log.islogin) {
        toast.warn("You are not Logged In",{ autoClose: 1300 })
        return <Navigate to='/login' />
    }
    const useralldetail = useSelector((state) => state.userexplist);
    const defaultprofile = "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png"
    useEffect(() => {
        dispatch(header("Profile Update"))
    }, [])
    const WIDTH = 200;
    const [isfile, setisfile] = useState(false);
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

    //   2nd method
    // const sub = async (event) => {
    //     document.body.style.cursor = 'wait';
    //     const token = localStorage.getItem("token");
    //     setisfile(false);
    //     setisuploading(true);
    //     let image_file = document.getElementById('dfe').files[0];
    //     let name = Date.now() + image_file.name;
    //     // console.log(name);
    //     let reader = new FileReader
    //     reader.readAsDataURL(image_file)
    //     reader.onload = async (event) => {
    //         let image_url = event.target.result
    //         let image = document.createElement('img');
    //         image.src = image_url;
    //         // document.querySelector("#wrapper").appendChild(image)
    //         image.onload = async (e) => {
    //             let canvas = document.createElement("canvas")
    //             let ratio = WIDTH / e.target.width
    //             canvas.width = WIDTH
    //             canvas.height = e.target.height * ratio
    //             //    console.log(canvas.height)
    //             const context = canvas.getContext("2d")
    //             context.drawImage(image, 0, 0, canvas.width, canvas.height)

    //             let new_image_url = context.canvas.toDataURL("image/jpeg", 100)

    //             let new_image = document.createElement("img");

    //             newimage = urlToFile(new_image_url, name);
    //             new_image.src = new_image_url

    //             let data = new FormData();

    //             data.append('file', newimage)
    //             data.append('upload_preset', "profilepic")
    //             data.append('"cloud_name"', "dusxlxlvm")
    //             // console.log(newimage);
    //             try {
    //                 const res = await fetch('https://api.cloudinary.com/v1_1/dusxlxlvm/image/upload', {
    //                     method: "POST",
    //                     body: data,
    //                 })
    //                 const result = await res.json();
    //                 // console.log(result)
    //                 if (result.url) {
    //                     try {
    //                         const resultfgg = await fetch(`${useralldetail.apiadress}/photo`, {
    //                             method: "POST",
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                                 "Authorization": `Bearer ${token}`,
    //                             },
    //                             body: JSON.stringify({
    //                                 userid: useralldetail.user._id,
    //                                 oldimage: useralldetail.user.imgsrc,
    //                                 newimage: result.url
    //                             })
    //                         })
    //                         const resuke = await resultfgg.json();
    //                         setisfile(true);
    //                         // console.log(resultfgg);
    //                         if (resultfgg.ok) {
    //                             document.body.style.cursor = 'default';
    //                             sethide(!hide)
    //                             reset();
    //                             setisuploading(false);
    //                             dispatch(profilepicupdtae(result.url))
    //                             toast.success("Photo Updated Successfully", 1500);
    //                             // <Navigate to='/' />
    //                         }
    //                     } catch (error) {
    //                         console.log(error)
    //                     }
    //                 }
    //                 // console.log(result);

    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         }
    //     }
    // }

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
                    const rese = await fetch(`${useralldetail.apiadress}/photo`, {
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
        console.log(name, phone);
        const token = localStorage.getItem("token");
        // console.log(name,phone,email);
        try {
            const query = await fetch(`${useralldetail.apiadress}/updateuserdetail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name, phone
                })
            })
            console.log(query);
            const result = await query.json();
            if (query.ok) {
                console.log(result);
                seteditable(!editable);
                dispatch(profiledetailupdtae(input))
                toast.success("Updated Successfull", { autoClose: 1300 });
            }
        } catch (error) {
            toast.warn("Something went wrong", { autoClose: 1500 });
            console.log(error);
        }
    }
    const [isuploading, setisuploading] = useState(false);
    const [hide, sethide] = useState(true);
    const [editable, seteditable] = useState(true);
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
    return (
        <>
            <div className="photo">
                <div className="profile">
                    <h2>User Profile Detail</h2>
                    <div className='upper'>
                        <div className="profile-header">
                            <img src={useralldetail.profilepic ? useralldetail.profilepic : defaultprofile} alt="User Avatar" />
                            <br />  <button onClick={hello}>Update profile</button> <br />
                        </div>
                        <div className="profile-bio">
                            <div>
                                <label htmlFor="name"> <h3 >Name</h3></label>
                                :<input style={{ outline: editable && "none" }} readOnly={editable} id='name' type="text" onChange={handle} name="name" defaultValue={input.name} />
                            </div>
                            <div>
                                <label htmlFor="phone"> <h3 >Phone</h3></label>
                                :<input style={{ outline: editable && "none" }} readOnly={editable} id='phone' type="tel" onChange={handle} name="phone" defaultValue={input.phone} />
                            </div>
                            <div>
                                <label htmlFor="email"> <h3 >Email</h3></label>
                                :<input style={{ outline: "none" }} title={editable && "Email Can't be Updated"} readOnly={true} id='email' type="text" onChange={handle} name="email" defaultValue={input.email} />
                            </div>
                            {!editable && <div>  <button onClick={updatedetails}>Update Deatils</button> </div>}
                            <i className="fa fa-pencil" title='Edit Details' aria-hidden="true" onClick={() => seteditable(!editable)}></i>
                        </div>
                    </div>
                    <div className={hide ? "lower hide" : "lower"}>
                        <input type="file" accept="image/*" onChange={hi} name="" id="dfe" />
                        <label htmlFor="dfe">Choose File</label>
                        <div id="wrapper">  </div>
                        <div id='btn'>
                            <button disabled={!isfile} onClick={sub} className={isfile ? null : "disabled"} ><i className="fa fa-cloud-upload" aria-hidden="true"></i>Upload</button>
                            {isfile ? <button onClick={reset} style={isfile ? xdfvf : dfvfdv}  ><i className="fa fa-undo" aria-hidden="true"></i>Clear</button> : null}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Photo