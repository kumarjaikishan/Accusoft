const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const asyncHandler = require('../utils/asyncHandler')
const user = require('../modals/login_schema')
const removePhotoBySecureUrl = require('../utils/cloudinaryremove')

// Set up S3 client
const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const getsignedurl = asyncHandler(async (req, res, next) => {
    const { name, type } = req.body;

    // Validate request data
    if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required." });
    }

    // Create the command for generating the presigned URL
    const command = new PutObjectCommand({
        Bucket: 'accusoft-kishan',
        Key: `accusoft/profile/${name}`,
        ContentType: type,
    });

    const url = await getSignedUrl(s3client, command, { expiresIn: 3600 });

    return res.status(200).json({
        url,
    });
});


const status = asyncHandler(async (req, res, next) => {
    const { imageurl, oldurl } = req.body;
    const userid = req.userid;

    const query = await user.findByIdAndUpdate({ _id: userid }, { imgsrc: imageurl });

    // console.log(oldurl)
    if (oldurl !== "" && oldurl.indexOf('accusoft-kishan') !== -1) {
        const deleteKey = oldurl.split('.com/')[1]; // Get the key from the URL
        const deleteQuery = await deleteObjectUrl(deleteKey);
    }

    if (oldurl !== "" && oldurl.indexOf('accusoft-kishan') === -1) {
        let arraye = [];
        arraye.push(oldurl);
        await removePhotoBySecureUrl(arraye);
    }

    res.status(201).json({
        message: "photo updated",
        url: imageurl
    })
});

async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: 'accusoft-kishan',
        Key: key,
    });
    const url = await getSignedUrl(s3client, command);
    return url;
}

async function putObjectUrl(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'accusoft-kishan',
        Key: `uploads/${filename}`,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3client, command, { expiresIn: 3600 });
    return url;
}




async function deleteObjectUrl(path) {
    const command = new DeleteObjectCommand({
        Bucket: 'accusoft-kishan',
        Key: path,
    });
    const response = await s3client.send(command);
    return response;
}


async function init() {
    try {
        // Example of generating a signed URL for fetching an object
        // console.log("Get URL:", await getObjectUrl('What.jpeg'));

        // Example of putting object a signed URL for uploading
        // console.log("Put URL:", await putObjectUrl(`image-${Date.now()}.jpeg`, "image/jpeg"));

        // Example of deleting Object a signed URL for uploading
        // console.log("Delete:", await deleteObjectUrl('uploads/image-1727855902298.jpeg'));

        console.log(" ")
    } catch (error) {
        console.error("Error:", error);
    }
}

// init();

module.exports = { getsignedurl, status };
