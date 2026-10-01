/**
 * Accusoft — Modern Email & OTP Templates
 * Design System aligned with Accusoft (Slate / Navy / Tech Blue #0070F3)
 */

/**
 * Generates the HTML template for Email Verification OTP
 * @param {Object} params
 * @param {string} params.name - User's display name
 * @param {string} params.otp - 6-Digit OTP code
 * @param {string} [params.appUrl] - Base application URL
 * @returns {string} HTML string
 */
const generateVerificationOtpEmailHtml = ({ name, otp, appUrl = 'https://accusoft.battlefiesta.in' }) => {
    const currentYear = new Date().getFullYear();
    const safeName = name ? name.trim() : 'Valued User';
    const formattedOtp = String(otp).split('');

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Verification Code — Accusoft</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0B1426; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        
        .otp-box {
            display: inline-block;
            width: 44px;
            height: 52px;
            line-height: 52px;
            font-size: 28px;
            font-weight: 800;
            color: #0070F3;
            background-color: #EFF6FF;
            border: 2px solid #BFDBFE;
            border-radius: 12px;
            text-align: center;
            margin: 0 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            box-shadow: 0 2px 6px rgba(0, 112, 243, 0.08);
        }

        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
            .content-padding { padding: 28px 18px !important; }
            .header-padding { padding: 24px 20px !important; }
            .otp-box { width: 38px; height: 46px; line-height: 46px; font-size: 24px; margin: 0 2px; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B1426; color: #334155;">
    <!-- Hidden Preheader -->
    <div style="display: none; font-size: 1px; color: #0B1426; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Your Accusoft verification code is ${otp}. Valid for 10 minutes.
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0B1426; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 32px 12px 48px 12px;">
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" class="header-padding" style="background: linear-gradient(135deg, #0B1B3D 0%, #0F172A 100%); padding: 32px 28px 26px 28px; border-bottom: 3px solid #0070F3;">
                            <span style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                                Accu<span style="color: #0070F3;">soft</span>
                            </span>
                            <div style="font-size: 9.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94A3B8; margin-top: 5px;">
                                EMAIL VERIFICATION CODE
                            </div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="content-padding" style="padding: 38px 32px 32px 32px; background-color: #ffffff;">
                            
                            <div align="center" style="padding-bottom: 18px;">
                                <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: #EFF6FF; border: 2px solid #DBEAFE; text-align: center; line-height: 64px; font-size: 28px;">
                                    🛡️
                                </div>
                            </div>

                            <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0F172A; text-align: center; letter-spacing: -0.4px;">
                                Confirm Your Email
                            </h1>

                            <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #334155; text-align: center;">
                                Hi <strong style="color: #0B1B3D; text-transform: capitalize;">${safeName}</strong>,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 1.6; color: #475569; text-align: center;">
                                Thank you for creating your account with Accusoft. Use the 6-digit verification code below to activate your workspace:
                            </p>

                            <!-- OTP Display Cards -->
                            <div align="center" style="margin: 24px 0 28px 0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        ${formattedOtp.map(digit => `<td><div class="otp-box">${digit}</div></td>`).join('')}
                                    </tr>
                                </table>
                            </div>

                            <!-- Expiry notice -->
                            <p style="margin: 0 0 24px 0; font-size: 13px; text-align: center; color: #64748B; font-weight: 500;">
                                ⏱️ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                            </p>

                            <!-- Security Alert Box -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 14px 16px; font-size: 12.5px; line-height: 1.5; color: #64748B;">
                                        🔒 <strong>Security Notice:</strong> If you did not create an Accusoft account, you can safely ignore this email.
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 20px 28px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
                            &copy; ${currentYear} Accusoft • Expense Management. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generates the HTML template for Password Reset OTP
 * @param {Object} params
 * @param {string} params.name - User's name
 * @param {string} params.otp - 6-Digit OTP code
 * @param {string} [params.appUrl] - Base application URL
 * @returns {string} HTML string
 */
const generateResetPasswordOtpEmailHtml = ({ name, otp, appUrl = 'https://accusoft.battlefiesta.in' }) => {
    const currentYear = new Date().getFullYear();
    const safeName = name ? name.trim() : 'Valued User';
    const formattedOtp = String(otp).split('');

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP — Accusoft</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; background-color: #0B1426; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .otp-box {
            display: inline-block;
            width: 44px;
            height: 52px;
            line-height: 52px;
            font-size: 28px;
            font-weight: 800;
            color: #0070F3;
            background-color: #EFF6FF;
            border: 2px solid #BFDBFE;
            border-radius: 12px;
            text-align: center;
            margin: 0 4px;
            font-family: 'SFMono-Regular', Consolas, monospace;
        }
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; border-radius: 0 !important; }
            .content-padding { padding: 28px 18px !important; }
            .otp-box { width: 38px; height: 46px; line-height: 46px; font-size: 24px; margin: 0 2px; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B1426; color: #334155;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0B1426; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 32px 12px 48px 12px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0B1B3D 0%, #0F172A 100%); padding: 32px 28px 26px 28px; border-bottom: 3px solid #0070F3;">
                            <span style="font-size: 28px; font-weight: 900; color: #ffffff;">
                                Accu<span style="color: #0070F3;">soft</span>
                            </span>
                            <div style="font-size: 9.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94A3B8; margin-top: 5px;">
                                SECURE PASSWORD RESET
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding: 38px 32px 32px 32px; background-color: #ffffff;">
                            <div align="center" style="padding-bottom: 18px;">
                                <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: #EFF6FF; border: 2px solid #DBEAFE; text-align: center; line-height: 64px; font-size: 28px;">
                                    🔑
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0F172A; text-align: center;">
                                Reset Your Password
                            </h1>
                            <p style="margin: 0 0 18px 0; font-size: 15px; color: #334155; text-align: center;">
                                Hi <strong style="color: #0B1B3D; text-transform: capitalize;">${safeName}</strong>,
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 14.5px; color: #475569; text-align: center;">
                                We received a request to reset your Accusoft password. Enter this 6-digit OTP code to verify your identity:
                            </p>
                            <div align="center" style="margin: 24px 0 28px 0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        ${formattedOtp.map(digit => `<td><div class="otp-box">${digit}</div></td>`).join('')}
                                    </tr>
                                </table>
                            </div>
                            <p style="margin: 0 0 24px 0; font-size: 13px; text-align: center; color: #64748B; font-weight: 500;">
                                ⏱️ This code expires in <strong>10 minutes</strong>.
                            </p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 14px 16px; font-size: 12.5px; line-height: 1.5; color: #64748B;">
                                        🔒 If you did not request a password reset, you can safely disregard this email. Your credentials remain safe.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 20px 28px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
                            &copy; ${currentYear} Accusoft • All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

module.exports = {
    generateVerificationOtpEmailHtml,
    generateResetPasswordOtpEmailHtml
};
