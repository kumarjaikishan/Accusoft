const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kumar.jaikishan0@gmail.com',
        pass: process.env.gmail_password
    }
});

const sendemail = async (receiver,subject, message) => {
    const mailOptions = {
        from: 'Accusoft <kumar.jaikishan0@gmail.com>',
        to: receiver,
        subject: subject,
        html: message
    };

    // Return a promise
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // Reject the promise with the error
                reject(error);
            } else {
                // Resolve the promise with true
                resolve(true);
            }
        });
    });
}

module.exports = sendemail;