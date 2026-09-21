const { S3Client, GetObjectCommand, PutObjectCommand,DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Set up S3 client
const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
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

async function putObjectUrls(files) {
    const urls = [];

    for (const file of files) {
        const { filename, contentType } = file;
        const command = new PutObjectCommand({
            Bucket: 'accusoft-kishan',
            Key: `accusoft/filehandle/${filename}`,
            ContentType: contentType,
            // ContentDisposition: 'attachment',
        });
        
        const url = await getSignedUrl(s3client, command, { expiresIn: 3600 });
        urls.push({ filename, url });
    }

    return urls;
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

module.exports = { putObjectUrls,deleteObjectUrl };
