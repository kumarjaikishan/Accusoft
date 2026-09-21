const File = require('../modals/file_schema');
const { ApiError } = require('../utils/apierror');
// const sendEmail = require('../utils/email');
// const { putObjectUrls, deleteObjectUrl } = require('../utils/s3');
const asyncHandler = require('../utils/asyncHandler')
const sendemail = require('../utils/sendemail')

// Create a new file entry
const createFileJob = asyncHandler(async (req, res) => {
    const { files: fileUrls, emailRecipients, days, messagee: message } = req.body;

    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
        return next({ status: 400, message: 'fileUrls must be a non-empty array' });
    }

    const currentDate = new Date();
    const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(days)));

    const file = new File({
        userid: req.userid,
        fileUrls,
        message,
        emailRecipients,
        expiryDate,
        days
    });

    await file.save();
    return res.status(201).json({ message: 'Files Job created successfully' });
});

const createFileurl = asyncHandler(async (req, res) => {
    const { files } = req.body;

    if (!files || files.length === 0) {
         throw new ApiError(400, "No files provided");
    }

    const urls = await putObjectUrls(files);

    return res.status(201).json({ message: 'Files created successfully', urls });
});

const deleteFileJob = asyncHandler(async (req, res) => {
    const job = await File.findById(req.body.jobid);

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    await File.findByIdAndDelete(req.body.jobid);

    // Delete associated files from S3
    for (const urls of job.fileUrls) {
        await deleteObjectUrl(urls.url.split('.com/')[1].split('%20').join(' '));
    }

    return res.status(200).json({ message: 'Job deleted successfully' });
});
const deleteasset = asyncHandler(async (req, res) => {
    // console.log(req.body)
    // console.log(req.body.url.split('.com/')[1].split('%20').join(' '))

    if (!req.body.url) {
        return res.status(404).json({ message: "url not found" });
    }
    await deleteObjectUrl(req.body.url.split('.com/')[1].split('%20').join(' '));
    const which = await File.findById(req.body.jobid)
    const filteredurl = which.fileUrls.filter((url, ind) => req.body.index != ind);
    await File.findByIdAndUpdate(req.body.jobid, { fileUrls: filteredurl })

    return res.status(200).json({ message: 'File deleted successfully' });
});


const getFilejobs = asyncHandler(async (req, res) => {

    const filejobs = await File.find({ userid: req.userid });  // You already created this function

    return res.status(201).json({ filejobs });
});

// update timer
const updateTimerall = asyncHandler(async (req, res) => {

    // Fetch all file jobs related to the user
    const fileJobs = await File.find({ userid: req.userid });

    if (!fileJobs || fileJobs.length === 0) {
        return next({ status: 400, message: 'No file jobs found for this user' });
    }

    const currentDate = new Date();
    const updatedJobs = await Promise.all(
        fileJobs.map(async (job) => {
            const newExpiryDate = new Date(currentDate);
            newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(job.days));
            // newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(13));

            job.expiryDate = newExpiryDate;

            await job.save();
            return job;
        })
    );

    return res.status(201).json({
        message: 'Timer Updated successfully'
    });
});
const updateoneTimer = asyncHandler(async (req, res) => {
    const fileJob = await File.findById(req.body.jobid);
    const currentDate = new Date();
    const newExpiryDate = new Date(currentDate);
    // newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(fileJob.days));
    newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(-7));
    const fileJobs = await File.findByIdAndUpdate({ _id: req.body.jobid }, { expiryDate: newExpiryDate });

    return res.status(201).json({
        message: 'Timer Updated successfully',
    });
});

const updateJob = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { emails, days, messagee } = req.body;

    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(days));
    if (req.body.files) {
        const filepreviousUrl = await File.findById(req.body.jobid);
        const updatedFileUrls = [...filepreviousUrl.fileUrls, ...req.body.files];
        const fileJob = await File.findByIdAndUpdate(req.body.jobid, {
            emailRecipients: emails, days, message: messagee,
            expiryDate: newExpiryDate, fileUrls: updatedFileUrls
        });
    }

    const fileJob = await File.findByIdAndUpdate(req.body.jobid, {
        emailRecipients: emails, days, message: messagee, expiryDate: newExpiryDate
    });

    return res.status(201).json({
        message: 'Job Updated',
    });
});


// Cron job to send expired files when the expiry date has passed
const sendExpiredFiles = async () => {
    // console.log("entered into function")
    const now = new Date();

    const expiredFiles = await File.find({ expiryDate: { $lte: now }, sent: false })
        .populate({ path: 'userid', select: 'name' });
    // console.log("send task",expiredFiles)

    for (let file of expiredFiles) {
        for (let recipient of file.emailRecipients) {
            // console.log(file.fileUrls)

            let href = '';
            for (let url of file.fileUrls) {
                href += ` <a download href=${url.url}> Download ${url.filename.split('flname')[0]}.${url.filename.split('.')[1]}</a> <br/>`
            }
            const msg = `
            <!DOCTYPE HTML
                PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
                <head> </head>
                 <body>
                 <div>
                 ${file.message}
                 </div>
                   ${href}
                  </body>
            </html>
            `
            const mailsent = await sendemail(recipient, `Urgent Message from ${file.userid.name}`, msg);
            if (mailsent) {
                console.log('Email sent successfully')
            }
        }

        file.sent = true;
        await file.save();
    }
};

module.exports = { createFileJob, updateJob, deleteasset, deleteFileJob, getFilejobs, sendExpiredFiles, updateTimerall, createFileurl, updateoneTimer };
