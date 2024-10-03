import { useState } from "react";
import './filehandle.css';
import { toast } from 'react-toastify';
import { useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import swal from 'sweetalert';
import { IoIosSave } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Filehandle = () => {
    const [files, setfiles] = useState([]);
    const [emails, setEmails] = useState('');
    const [modalopen, setmodalopen] = useState(false);
    const [days, setdays] = useState('');
    const [jobs, setjobs] = useState(null);
    const [messagee, setmessage] = useState('');
    const [disable, setdisable] = useState(false)

    useEffect(() => {
        firstfetch()
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
        // console.log(data)
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
                    console.log(uploadRes);
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
            setmodalopen(false);
            if (!fileJobRes.ok) throw new Error("Error occurred while creating the file job");
            const { message } = await fileJobRes.json();
            firstfetch();
            setEmails('')
            setdays('')
            setfiles([])
            toast.update(id, { render: message, type: "success", isLoading: false, autoClose: 1300 });
        } catch (error) {
            setdisable(false)
            console.error('Failed to create file job:', error);
            toast.update(id, { render: error.message, type: "warning", isLoading: false, autoClose: 2600 });
        }
    };

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

    return (
        <div className="filehandle">
            <div style={{ margin: '5px 0px', display: 'flex', justifyContent: 'center' }}>

                <Button className='muibtn' sx={{ mr: 5 }} onClick={() => setmodalopen(true)} disabled={disable} variant="contained" startIcon={<MdOutlineUpdate />}>
                    Create New
                </Button>
                <Button className='muibtn outlined' onClick={() => updateTimerall()} variant="outlined" startIcon={<IoIosSave />}>
                    update timer
                </Button>
            </div>

            <div className="table">
                <table>
                    <thead>
                        <tr className="header">
                            <th>S.no</th>
                            <th>Days</th>
                            <th>Expiry</th>
                            <th>Remaining</th>
                            <th>Files</th>
                            <th>Emails</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="body">
                        {jobs?.map((job, ind) => {
                            // Calculate remaining days
                            const expiryDate = new Date(job.expiryDate);
                            const today = new Date();
                            const timeDiff = expiryDate - today;
                            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

                            return (
                                <tr className="bodyrow" key={ind}>
                                    <td>{ind + 1}</td>
                                    <td>{job.days}</td>
                                    <td>
                                        {expiryDate.toLocaleDateString('en-GB', { // Formatting date as '26 Nov, 2024'
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        {daysRemaining} days
                                    </td>
                                    <td>
                                        <ul>
                                            {job.fileUrls?.map((file, fileIndex) => (
                                                <li key={fileIndex}>{fileIndex + 1}. {file.filename.split('flname')[0]}.{file.filename.split('flname')[1].split('.')[1]}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            {job.emailRecipients?.map((email, emailIndex) => (
                                                <li key={emailIndex}>{emailIndex + 1}. {email}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <HiPencilSquare title="Edit" className='editicon ico' />
                                        <MdOutlineUpdate title="Refresh" onClick={() => updateTimerone(job._id)} className='refresh ico' />
                                        <RiDeleteBin6Line title="Delete" onClick={() => deleteJob(job._id)} className='deleteicon ico' />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {modalopen && <div className="modale">
                <form onSubmit={handleSubmit}>
                    <h2>Create File Job</h2>

                    {/* File Upload */}
                    <div>
                        <label>Upload Files:</label> <br />
                        <input type="file" multiple onChange={handleFileChange} />
                    </div>


                    <div>
                        <TextField fullWidth id="outlined-basic" label="Email Recipients" name="email"
                            value={emails}
                            onChange={handleEmailChange}
                            helperText="Add multiple Emails with comma-separated"
                            size="small"
                            variant="outlined" />
                    </div>

                    <div>
                        <TextField fullWidth id="outlined-basic" label="Days" name="days"
                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                            type="tel" value={days}
                            onChange={handledayChange}
                            helperText="Number of days you want"
                            size="small"
                            variant="outlined" />
                    </div>
                    <div>
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
                        <Button className='muibtn' disabled={disable} type="submit" variant="contained" startIcon={<MdOutlineUpdate />}>
                            Create Job
                        </Button>
                        <Button className='muibtn outlined' onClick={() => setmodalopen(false)} variant="outlined" startIcon={<IoIosSave />}>
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
