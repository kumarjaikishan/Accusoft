import { useState, useEffect } from "react";
import { Pencil, Trash2, Save, RefreshCw } from 'lucide-react';

import { toast } from 'react-toastify';

import swal from 'sweetalert';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Filehandle = () => {
    const [files, setfiles] = useState([]);
    const [ure, seture] = useState([])
    const [emails, setEmails] = useState('');
    const [modalopen, setmodalopen] = useState(false);
    const [days, setdays] = useState('');
    const [jobs, setjobs] = useState(null);
    const [messagee, setmessage] = useState('');
    const [disable, setdisable] = useState(false);
    const [isupdate, setisupdate] = useState(false);
    const [jobid, setjobid] = useState('')

    useEffect(() => {
        // firstfetch()
    }, [])

    const handleFileChange = (e) => {
        const filese = Array.from(e.target.files);
        setfiles(filese);
    };

    const handleEmailChange = (e) => {
        setEmails(e.target.value);
    };

    const handledayChange = (e) => {
        setdays(e.target.value);
    };
    const handlemessageChange = (e) => {
        setmessage(e.target.value);
    };

    const firstfetch = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}getFilejobs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setjobs(data?.filejobs)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRecipientss = emails.split(',').map(email => email.trim());

        // Regular expression for validating email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if all emails are valid
        const invalidEmails = emailRecipientss.filter(email => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
            return toast.warn(`Invalid email(s): ${invalidEmails.join(', ')}`, { autoClose: 1900 }); // Prevent form submission
        }
        const id = toast.loading("Please wait...")

        const emailRecipients = emails.split(',').map(email => email.trim());
        try {
            setdisable(true);
            const token = localStorage.getItem("token");
            const filesen = files.map(file => {
                const fileExtension = file.name.split('.').pop();
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

                return {
                    filename: `${fileNameWithoutExt}flname${Date.now()}.${fileExtension}`,
                    contentType: file.type
                };
            });

            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}createFileurl`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ files: filesen }) // Sending filenames and contentTypes
            });

            if (!res.ok) throw new Error("Error occurred while creating presigned URLs");

            // Parse the response which contains the pre-signed URLs
            const { urls } = await res.json();

            await Promise.all(
                urls.map(async (urlObj, index) => {
                    const file = files[index];
                    const uploadRes = await fetch(urlObj.url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type // Ensure correct MIME type
                        },
                        body: file // The actual file blob
                    });
                    if (!uploadRes.ok) throw new Error(`Error uploading file: ${file.name}`);
                })
            );

            const fileJobRes = await fetch(`${import.meta.env.VITE_API_ADDRESS}createFileJob`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    emailRecipients,
                    days,
                    messagee,
                    files: urls.map((urlObj, index) => ({
                        filename: filesen[index].filename,
                        url: urlObj.url.split('?')[0] // Save the S3 URL without query params
                    }))
                })
            });

            setdisable(false)
            if (!fileJobRes.ok) throw new Error("Error occurred while creating the file job");
            const { message } = await fileJobRes.json();
            firstfetch();
            reset();
            toast.update(id, { render: message, type: "success", isLoading: false, autoClose: 1300 });
        } catch (error) {
            setdisable(false)
            console.error('Failed to create file job:', error);
            toast.update(id, { render: error.message, type: "warning", isLoading: false, autoClose: 2600 });
        }
    };
    const reset = () => {
        setmodalopen(false);
        setEmails('')
        setdays('')
        setmessage('')
        setfiles([])
        seture([])
        setisupdate(false)
    }

    const deleteJob = async (jobid) => {
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this Data!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const token = localStorage.getItem("token");
                    const jobdelete = await fetch(`${import.meta.env.VITE_API_ADDRESS}deleteFileJob`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            jobid
                        })
                    });
                    const data = await jobdelete.json();
                    if (!jobdelete.ok) return toast.warn(data.message, { autoClose: 1900 });
                    firstfetch();
                    reset();
                    toast.success(data.message, { autoClose: 1500 });
                } catch (error) {
                    console.log(error)
                    // toast.error(error.message, { autoClose: 2300 });
                }
            } else {
                // swal('Your data is safe!');
            }
        });
    }

    const setedit = (job) => {
        setjobid(job._id)
        setEmails(job.emailRecipients)
        setdays(job.days)
        setmessage(job.message)
        setisupdate(true)
        setmodalopen(true)
        seture(job.fileUrls);
    }

    const update = async () => {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_ADDRESS;

        try {
            // If there are files to upload
            if (files.length) {
                const filesen = files.map(file => {
                    const fileExtension = file.name.split('.').pop();
                    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                    return {
                        filename: `${fileNameWithoutExt}flname${Date.now()}.${fileExtension}`,
                        contentType: file.type
                    };
                });

                const res = await fetch(`${apiUrl}createFileurl`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ files: filesen })
                });

                if (!res.ok) throw new Error("Error occurred while creating presigned URLs");

                const { urls } = await res.json();

                await Promise.all(
                    urls.map((urlObj, index) =>
                        fetch(urlObj.url, {
                            method: "PUT",
                            headers: { "Content-Type": files[index].type },
                            body: files[index]
                        })
                    )
                );

                await updateJob(urls.map((urlObj, index) => ({
                    filename: filesen[index].filename,
                    url: urlObj.url.split('?')[0]
                })));
            } else {
                await updateJob();
            }

            firstfetch();
            setisupdate(false)
            reset();
            toast.success("Update successful", { autoClose: 1500 });
        } catch (error) {
            setisupdate(false)
            console.error(error);
            toast.error(error.message, { autoClose: 2300 });
        }
    };

    // Helper function to handle job update
    const updateJob = async (fileData = []) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateJob`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                jobid, emails, days, messagee, files: fileData
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
    };

    const updateTimerall = async () => {
        try {
            const token = localStorage.getItem("token");
            const updatequery = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateTimerall`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({

                })
            });
            const data = await updatequery.json();
            if (!updatequery.ok) return toast.warn(data.message, { autoClose: 1900 });
            firstfetch();
            toast.success(data.message, { autoClose: 1500 });
        } catch (error) {
            console.log(error)
            toast.error(error.message, { autoClose: 2300 });
        }
    }
    const updateTimerone = async (jobid) => {
        try {
            const token = localStorage.getItem("token");
            const updatequery = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateoneTimer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobid
                })
            });
            const data = await updatequery.json();
            if (!updatequery.ok) return toast.warn(data.message, { autoClose: 1900 });
            firstfetch();
            toast.success(data.message, { autoClose: 1500 });
        } catch (error) {
            console.log(error)
            toast.error(error.message, { autoClose: 2300 });
        }
    }
    const assetdelete = async (url, index) => {
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this Data!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const token = localStorage.getItem("token");
                    const updatequery = await fetch(`${import.meta.env.VITE_API_ADDRESS}deleteasset`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            url: url.url,
                            index, jobid
                        })
                    });
                    const data = await updatequery.json();
                    setmodalopen(false)
                    reset()
                    if (!updatequery.ok) return toast.warn(data.message, { autoClose: 1900 });
                    firstfetch();
                    toast.success(data.message, { autoClose: 1500 });
                } catch (error) {
                    reset()
                    setmodalopen(false)
                    console.log(error)
                    toast.error(error.message, { autoClose: 2300 });
                }
            } else {

            }
        })
    }

    return (
        <div className="w-full h-full overflow-hidden relative p-[5px]">
            <div style={{ margin: '5px 0px', display: 'flex', justifyContent: 'center' }}>
                <Button className='muibtn' sx={{ mr: 5 }} onClick={() => setmodalopen(true)} disabled={disable} variant="contained" startIcon={<RefreshCw />}>
                    Create New
                </Button>
                <Button className='muibtn outlined' onClick={() => updateTimerall()} variant="outlined" startIcon={<Save />}>
                    update timer
                </Button>
            </div>

            <div className="w-full overflow-auto h-[calc(100%-80px)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-black text-white border border-black">
                            <th className="border border-black p-2 text-left">S.no</th>
                            <th className="border border-black p-2 text-left">Days</th>
                            <th className="border border-black p-2 text-left">Expiry</th>
                            <th className="border border-black p-2 text-left">Remaining</th>
                            <th className="border border-black p-2 text-left">Files</th>
                            <th className="border border-black p-2 text-left">Emails</th>
                            <th className="border border-black p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {jobs?.map((job, ind) => {
                            // Calculate remaining days
                            const expiryDate = new Date(job.expiryDate);
                            const today = new Date();
                            const timeDiff = expiryDate - today;
                            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

                            return (
                                <tr className="border border-black" key={ind}>
                                    <td className="border border-black p-2 text-left">{ind + 1}</td>
                                    <td className="border border-black p-2 text-left">{job.days}</td>
                                    <td className="border border-black p-2 text-left">
                                        {expiryDate.toLocaleDateString('en-GB', { // Formatting date as '26 Nov, 2024'
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="border border-black p-2 text-left">
                                        {daysRemaining} days
                                    </td>
                                    <td className="border border-black p-2 text-left">
                                        {job.fileUrls?.map((file, fileIndex) => (
                                            <div className="flex justify-between items-center mb-1" key={fileIndex}>
                                                <span className="w-[calc(100%-42px)] leading-tight" key={fileIndex}>{fileIndex + 1}. {file.filename.split('flname')[0]}.{file.filename.split('flname')[1].split('.')[1]}
                                                </span>
                                                <span className="w-[40px] text-center">
                                                    <Trash2 title={`Delete ${file.filename.split('flname')[0]}`} onClick={() => assetdelete(file, fileIndex)} className='p-[3px] box-content w-[20px] h-[20px] rounded-[.2rem] cursor-pointer mx-[5px] text-[var(--deleteicon)] bg-[rgba(182,7,16,0.116)] hover:bg-[var(--deleteicon)] hover:text-white' />
                                                </span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border border-black p-2 text-left">
                                        <ul className="list-none">
                                            {job.emailRecipients?.map((email, emailIndex) => (
                                                <li key={emailIndex}>{emailIndex + 1}. {email}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="border border-black p-2 text-center whitespace-nowrap">
                                        <Pencil title="Edit" onClick={() => setedit(job)} className='p-[3px] box-content w-[20px] h-[20px] rounded-[.2rem] cursor-pointer mx-[5px] text-[var(--editicon)] bg-[rgba(7,121,182,0.116)] hover:bg-[var(--editicon)] hover:text-[var(--background)]' />
                                        <RefreshCw title="Refresh" onClick={() => updateTimerone(job._id)} className='p-[3px] box-content w-[20px] h-[20px] rounded-[.2rem] cursor-pointer mx-[5px] text-[var(--printicon)] bg-[rgba(4,198,85,0.116)] hover:bg-[var(--printicon)] hover:text-white' />
                                        <Trash2 title="Delete" onClick={() => deleteJob(job._id)} className='p-[3px] box-content w-[20px] h-[20px] rounded-[.2rem] cursor-pointer mx-[5px] text-[var(--deleteicon)] bg-[rgba(182,7,16,0.116)] hover:bg-[var(--deleteicon)] hover:text-white' />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {modalopen && <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[5px] flex items-center justify-center z-[100]">
                <form className="rounded-[10px] overflow-hidden bg-white shadow-[10px_10px_25px_5px_rgba(0,0,0,0.3)] w-[400px]" onSubmit={handleSubmit}>
                    <h2 className="w-full text-center bg-[var(--maincolor)] text-white py-[5px]">Create File Job</h2>

                    {/* File Upload */}
                    <div className="px-[10px] py-[5px] text-center mt-[5px]">
                        {isupdate ? <label>Add New Files:</label> :
                            <label>Upload Files:</label>}
                        <br />
                        <input className="w-full text-center" type="file" multiple onChange={handleFileChange} />
                    </div>
                
                    <div className="px-[10px] py-[5px] text-center mt-[5px]">
                        <TextField fullWidth id="outlined-basic" label="Email Recipients" name="email"
                            value={emails}
                            onChange={handleEmailChange}
                            helperText="Add multiple Emails with comma-separated"
                            size="small"
                            variant="outlined" />
                    </div>

                    <div className="px-[10px] py-[5px] text-center mt-[5px]">
                        <TextField fullWidth id="outlined-basic" label="Days" name="days"
                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                            type="tel" value={days}
                            onChange={handledayChange}
                            helperText="Number of days you want"
                            size="small"
                            variant="outlined" />
                    </div>
                    <div className="px-[10px] py-[5px] text-center mt-[5px]">
                        <TextField fullWidth id="outlined-basic" label="Message" name="message"
                            multiline
                            rows={4}
                            value={messagee}
                            onChange={handlemessageChange}
                            helperText="Message For Your relatives"
                            size="small"
                            variant="outlined" />
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {isupdate ? <Button className='muibtn' disabled={disable} onClick={update} variant="contained" startIcon={<RefreshCw />}>
                            Update
                        </Button> : <Button className='muibtn' disabled={disable} type="submit" variant="contained" startIcon={<RefreshCw />}>
                            Create Job
                        </Button>}

                        <Button className='muibtn outlined' onClick={reset} variant="outlined" startIcon={<Save />}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
            }
        </div>
    );
};

export default Filehandle;
