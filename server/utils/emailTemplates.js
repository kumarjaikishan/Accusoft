/**
 * Accusoft — Modern Email & Verification Templates
 * Design System aligned with Accusoft (Slate / Navy / Tech Blue #0070F3)
 */

/**
 * Generates the HTML template for Email Verification
 * @param {Object} params
 * @param {string} params.name - User's display name
 * @param {string} params.verificationUrl - Verification link
 * @param {string} [params.appUrl] - Base application URL
 * @returns {string} HTML string
 */
const generateVerificationEmailHtml = ({ name, verificationUrl, appUrl = 'https://accusoft.battlefiesta.in' }) => {
    const currentYear = new Date().getFullYear();
    const safeName = name ? name.trim() : 'Valued User';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Verify Your Email — Accusoft</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0B1426; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        
        .btn-hover:hover {
            background-color: #0056b3 !important;
            box-shadow: 0 6px 20px rgba(0, 112, 243, 0.45) !important;
        }

        @media only screen and (max-width: 620px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 0 !important;
            }
            .content-padding {
                padding: 28px 20px !important;
            }
            .header-padding {
                padding: 24px 20px !important;
            }
            .btn-action {
                width: 100% !important;
                display: block !important;
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B1426; color: #334155;">
    <!-- Hidden Preheader Text for Inbox Snippets -->
    <div style="display: none; font-size: 1px; color: #0B1426; line-height: 1px; font-family: sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
        Welcome to Accusoft! Please verify your email address to activate your expense management and financial workspace.
    </div>

    <!-- Outer Background Wrapper -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0B1426; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 32px 12px 48px 12px;">
                
                <!-- Main Email Card Container (Max 600px) -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.1);">
                    
                    <!-- 🌟 Header Section with Brand Colors & Logo -->
                    <tr>
                        <td align="center" class="header-padding" style="background: linear-gradient(135deg, #0B1B3D 0%, #0F172A 100%); padding: 36px 32px 30px 32px; border-bottom: 3px solid #0070F3;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <!-- Brand Title -->
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                                    <span style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                                                        Accu<span style="color: #0070F3;">soft</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top: 6px;">
                                                    <span style="display: inline-block; font-size: 9.5px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: #94A3B8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                                        ACCOUNTS <span style="color: #0070F3; font-weight: 900;">•</span> EXPENSES <span style="color: #0070F3; font-weight: 900;">•</span> LEDGER <span style="color: #0070F3; font-weight: 900;">•</span> VAULT
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ✉️ Main Body Content -->
                    <tr>
                        <td class="content-padding" style="padding: 40px 36px 36px 36px; background-color: #ffffff;">
                            
                            <!-- Central Icon Badge -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 22px;">
                                        <div style="display: inline-block; width: 68px; height: 68px; border-radius: 50%; background: #EFF6FF; border: 2px solid #DBEAFE; text-align: center; line-height: 68px; box-shadow: 0 4px 12px rgba(0, 112, 243, 0.12);">
                                            <span style="font-size: 32px; line-height: 68px;">✉️</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Heading -->
                            <h1 style="margin: 0 0 12px 0; font-size: 23px; font-weight: 800; color: #0F172A; text-align: center; letter-spacing: -0.4px; line-height: 1.3;">
                                Verify Your Email Address
                            </h1>

                            <!-- Intro Greeting -->
                            <p style="margin: 0 0 20px 0; font-size: 15.5px; line-height: 1.65; color: #334155; text-align: center;">
                                Hi <strong style="color: #0B1B3D; text-transform: capitalize;">${safeName}</strong>,
                            </p>

                            <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #475569; text-align: center;">
                                Welcome to <strong>Accusoft</strong>! We're excited to have you on board. To complete your account setup and unlock full access to your financial dashboard, please confirm your email address below.
                            </p>

                            <!-- Primary CTA Button -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="border-radius: 12px; background: #0070F3; box-shadow: 0 6px 18px rgba(0, 112, 243, 0.35);">
                                                    <a href="${verificationUrl}" target="_blank" class="btn-hover btn-action" style="display: inline-block; padding: 15px 38px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.3px; border: 1px solid #0070F3; transition: all 0.2s ease;">
                                                        Verify Email &amp; Activate Account &rarr;
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security / Info Alert Box -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 26px;">
                                <tr>
                                    <td style="padding: 16px 18px;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="26" valign="top" style="font-size: 16px; padding-top: 1px;">
                                                    🔒
                                                </td>
                                                <td style="font-size: 13px; line-height: 1.55; color: #64748B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                                    <strong style="color: #334155;">Security Notice:</strong> If you did not sign up for an Accusoft account, no action is needed. You can safely disregard this email.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Fallback Link Section -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-top: 10px; border-top: 1px dashed #E2E8F0;">
                                        <p style="margin: 0 0 8px 0; font-size: 12.5px; line-height: 1.5; color: #64748B;">
                                            Having trouble clicking the button? Copy and paste this URL into your browser:
                                        </p>
                                        <p style="margin: 0; font-size: 12px; line-height: 1.5; word-break: break-all; color: #0070F3; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; background-color: #F1F5F9; padding: 10px 12px; border-radius: 8px; border: 1px solid #E2E8F0;">
                                            <a href="${verificationUrl}" target="_blank" style="color: #0070F3; text-decoration: none;">${verificationUrl}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- 🛡️ Footer Section -->
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="font-size: 12px; line-height: 1.6; color: #94A3B8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                        <p style="margin: 0 0 6px 0; font-weight: 600; color: #64748B;">
                                            Accusoft — Smart Financial &amp; Expense Management
                                        </p>
                                        <p style="margin: 0 0 10px 0;">
                                            &copy; ${currentYear} Accusoft. All rights reserved.
                                        </p>
                                        <p style="margin: 0; font-size: 11.5px;">
                                            <a href="${appUrl}" target="_blank" style="color: #0070F3; text-decoration: none; font-weight: 600;">Visit Website</a>
                                            &nbsp;&bull;&nbsp;
                                            <a href="${appUrl}/contact" target="_blank" style="color: #64748B; text-decoration: none;">Support &amp; Inquiries</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- End Main Card -->

            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generates the HTML for Password Reset Email
 * @param {Object} params
 * @param {string} params.name - User's name
 * @param {string} params.resetUrl - Password reset link
 * @param {string} [params.appUrl] - Base application URL
 * @returns {string} HTML string
 */
const generateResetPasswordEmailHtml = ({ name, resetUrl, appUrl = 'https://accusoft.battlefiesta.in' }) => {
    const currentYear = new Date().getFullYear();
    const safeName = name ? name.trim() : 'Valued User';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset Your Password — Accusoft</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0B1426; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .btn-hover:hover { background-color: #0056b3 !important; }
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; border-radius: 0 !important; }
            .content-padding { padding: 28px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0B1426; color: #334155;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0B1426; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 32px 12px 48px 12px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0B1B3D 0%, #0F172A 100%); padding: 36px 32px 30px 32px; border-bottom: 3px solid #0070F3;">
                            <span style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                                Accu<span style="color: #0070F3;">soft</span>
                            </span>
                            <div style="font-size: 9.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94A3B8; margin-top: 6px;">
                                SECURE CREDENTIAL RECOVERY
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding: 40px 36px 36px 36px; background-color: #ffffff;">
                            <div align="center" style="padding-bottom: 20px;">
                                <div style="display: inline-block; width: 68px; height: 68px; border-radius: 50%; background: #EFF6FF; border: 2px solid #DBEAFE; text-align: center; line-height: 68px;">
                                    <span style="font-size: 32px; line-height: 68px;">🔑</span>
                                </div>
                            </div>
                            <h1 style="margin: 0 0 12px 0; font-size: 23px; font-weight: 800; color: #0F172A; text-align: center; letter-spacing: -0.4px;">
                                Password Reset Request
                            </h1>
                            <p style="margin: 0 0 20px 0; font-size: 15.5px; line-height: 1.65; color: #334155; text-align: center;">
                                Hi <strong style="color: #0B1B3D; text-transform: capitalize;">${safeName}</strong>,
                            </p>
                            <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #475569; text-align: center;">
                                We received a request to reset the password for your Accusoft account. Click the button below to choose a new password.
                            </p>
                            <div align="center" style="margin-bottom: 30px;">
                                <a href="${resetUrl}" target="_blank" class="btn-hover" style="display: inline-block; padding: 15px 38px; font-size: 15px; font-weight: 700; color: #ffffff; background-color: #0070F3; text-decoration: none; border-radius: 12px; box-shadow: 0 6px 18px rgba(0, 112, 243, 0.35);">
                                    Reset Password &rarr;
                                </a>
                            </div>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 14px 18px; font-size: 13px; line-height: 1.55; color: #64748B;">
                                        🔒 If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                                    </td>
                                </tr>
                            </table>
                            <div style="border-top: 1px dashed #E2E8F0; padding-top: 14px;">
                                <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">Direct link:</p>
                                <p style="margin: 0; font-size: 12px; word-break: break-all; color: #0070F3; background: #F1F5F9; padding: 10px; border-radius: 8px; border: 1px solid #E2E8F0;">
                                    <a href="${resetUrl}" style="color: #0070F3; text-decoration: none;">${resetUrl}</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
                            &copy; ${currentYear} Accusoft. All rights reserved.
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
 * Generates the HTML landing page for successful verification
 * @param {Object} params
 * @param {string} params.name - User's name
 * @param {string} [params.appUrl] - Base application URL
 * @returns {string} HTML string
 */
const generateVerificationSuccessHtml = ({ name, appUrl = 'https://accusoft.battlefiesta.in' }) => {
    const safeName = name ? name.trim() : 'there';
    const loginUrl = `${appUrl}/login`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Verified Successfully | Accusoft</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: radial-gradient(circle at 50% 10%, #0F172A 0%, #0B1120 50%, #020617 100%);
            color: #F8FAFC;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
            position: relative;
        }

        /* Subtle glowing background orbs */
        .glow-orb-1 {
            position: absolute;
            width: 450px;
            height: 450px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 112, 243, 0.25) 0%, rgba(0, 112, 243, 0) 70%);
            top: -100px;
            left: -100px;
            pointer-events: none;
            filter: blur(40px);
        }
        .glow-orb-2 {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%);
            bottom: -80px;
            right: -80px;
            pointer-events: none;
            filter: blur(40px);
        }

        .card {
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 28px;
            padding: 48px 40px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.96);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .brand-logo {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #FFFFFF;
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-bottom: 28px;
        }
        .brand-logo .accent {
            color: #0070F3;
        }

        .icon-wrap {
            width: 88px;
            height: 88px;
            margin: 0 auto 24px auto;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 112, 243, 0.2));
            border: 2px solid rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 0 35px rgba(16, 185, 129, 0.3);
            animation: pulseGlow 2.5s infinite ease-in-out;
        }

        @keyframes pulseGlow {
            0%, 100% {
                box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 45px rgba(16, 185, 129, 0.5);
                transform: scale(1.04);
            }
        }

        .checkmark-svg {
            width: 44px;
            height: 44px;
            stroke: #10B981;
            stroke-width: 3.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawCheck 0.8s 0.3s ease-out forwards;
        }

        @keyframes drawCheck {
            to {
                stroke-dashoffset: 0;
            }
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: -0.5px;
            margin-bottom: 12px;
        }

        p {
            font-size: 15px;
            line-height: 1.6;
            color: #94A3B8;
            margin-bottom: 32px;
        }

        .user-highlight {
            color: #38BDF8;
            font-weight: 600;
            text-transform: capitalize;
        }

        .btn-continue {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px 28px;
            background: linear-gradient(135deg, #0070F3 0%, #2563EB 100%);
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.2px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 25px rgba(0, 112, 243, 0.4);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
        }

        .btn-continue:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(0, 112, 243, 0.55);
            background: linear-gradient(135deg, #0060df 0%, #1d4ed8 100%);
        }

        .btn-continue:active {
            transform: translateY(1px);
        }

        .timer-note {
            margin-top: 20px;
            margin-bottom: 0;
            font-size: 13px;
            color: #64748B;
        }
        .timer-note span {
            color: #38BDF8;
            font-weight: 600;
        }

        @media (max-width: 480px) {
            .card {
                padding: 36px 24px;
                border-radius: 22px;
            }
            h1 {
                font-size: 22px;
            }
            p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="glow-orb-1"></div>
    <div class="glow-orb-2"></div>

    <div class="card">
        <div class="brand-logo">
            <span>Accu</span><span class="accent">soft</span>
        </div>

        <div class="icon-wrap">
            <svg class="checkmark-svg" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="23" stroke="rgba(16, 185, 129, 0.25)" fill="none" stroke-width="3"/>
                <path d="M14 27 L22 35 L38 18" />
            </svg>
        </div>

        <h1>Email Verified Successfully!</h1>
        <p>
            Congratulations <span class="user-highlight">${safeName}</span>, your Accusoft account has been verified and activated. You can now access all financial tracking, ledger, and analytics features.
        </p>

        <a href="${loginUrl}" class="btn-continue" id="loginBtn">
            <span>Continue to Sign In</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </a>

        <p class="timer-note">
            Redirecting to login in <span id="countdown">5</span>s...
        </p>
    </div>

    <script>
        let timeLeft = 5;
        const countdownEl = document.getElementById('countdown');
        const loginUrl = "${loginUrl}";

        const timer = setInterval(() => {
            timeLeft -= 1;
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                window.location.href = loginUrl;
            }
        }, 1000);
    </script>
</body>
</html>`;
};

module.exports = {
    generateVerificationEmailHtml,
    generateResetPasswordEmailHtml,
    generateVerificationSuccessHtml
};
