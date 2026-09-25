const nodemailer = require('nodemailer');
const user = require('../modals/login_schema');
const { generateVerificationEmailHtml } = require('../utils/emailTemplates');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kumar.jaikishan0@gmail.com',
        pass: process.env.gmail_password
    }
});

const emailmiddleware = async (req, res, next) => {
    try {
        const query = await user.findOne({ email: req.body.email });
        if (!query) {
            return next({ statusCode: 400, message: "User not found" });
        }
        if (query.isverified) {
            next();
        } else {
            const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
            const verificationUrl = `${appUrl}/api/verify?id=${query._id}`;

            const mailOptions = {
                from: 'Accusoft <kumar.jaikishan0@gmail.com>',
                to: query.email,
                subject: 'Verify your email address • Accusoft',
                html: generateVerificationEmailHtml({
                    name: query.name,
                    verificationUrl,
                    appUrl
                })
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                    return res.status(500).json({
                        message: "Failed to send verification email",
                        error: error.message
                    });
                } else {
                    res.status(201).json({
                        message: "Email sent, check your inbox",
                    });
                    console.log('Verification email sent:', info.response);
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message || error
        });
    }
};

module.exports = emailmiddleware;
