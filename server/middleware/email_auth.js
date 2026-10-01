const sendemail = require('../utils/sendemail');
const user = require('../modals/login_schema');
const { generateVerificationOtpEmailHtml } = require('../utils/emailTemplates');

const generateOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const emailmiddleware = async (req, res, next) => {
    try {
        const query = await user.findOne({ email: req.body.email.toLowerCase().trim() });
        if (!query) {
            return next({ status: 400, message: "User not found" });
        }
        if (query.isverified) {
            return next();
        }

        // Generate 6-Digit OTP with 10 minute expiry
        const otpCode = generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await user.findByIdAndUpdate(query._id, {
            otp: {
                code: otpCode,
                expiresAt,
                otpType: 'verify_email'
            }
        });

        const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
        const msg = generateVerificationOtpEmailHtml({
            name: query.name,
            otp: otpCode,
            appUrl
        });

        await sendemail(query.email, 'Your Verification Code • Accusoft', msg);

        return res.status(200).json({
            message: "OTP sent to your email",
            requiresVerification: true,
            email: query.email
        });
    } catch (error) {
        console.error('[emailmiddleware error]:', error);
        return res.status(500).json({
            message: "Failed to send verification OTP",
            error: error.message || error
        });
    }
};

module.exports = emailmiddleware;

