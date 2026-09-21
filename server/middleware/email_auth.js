const nodemailer = require('nodemailer');
const user = require('../modals/login_schema');

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
        // console.log(query);
        if (!query) {
            return next({ statusCode: 400, message: "User not found" });
        }
        if (query.isverified) {
            next();
        } else {
            const mailOptions = {
                from: 'Accusoft <kumar.jaikishan0@gmail.com>',
                to: query.email,
                subject: 'Email Verification | Accusoft',
                html: `<!DOCTYPE HTML
                PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="x-apple-disable-message-reformatting">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title></title>
            
                <style type="text/css">
                    @media only screen and (min-width: 620px) {
                        .u-row {
                            width: 600px !important;
                        }
            
                        .u-row .u-col {
                            vertical-align: top;
                        }
            
                        .u-row .u-col-100 {
                            width: 600px !important;
                        }
                    }
            
                    @media (max-width: 620px) {
                        .u-row-container {
                            max-width: 100% !important;
                            padding-left: 0px !important;
                            padding-right: 0px !important;
                        }
            
                        .u-row .u-col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                        }
            
                        .u-row {
                            width: 100% !important;
                        }
            
                        .u-col {
                            width: 100% !important;
                        }
            
                        .u-col>div {
                            margin: 0 auto;
                        }
                    }
            
                    body {
                        margin: 0;
                        padding: 0;
                    }
            
                    table,
                    tr,
                    td {
                        vertical-align: top;
                        border-collapse: collapse;
                    }
            
                    p {
                        margin: 0;
                    }
            
                    .ie-container table,
                    .mso-container table {
                        table-layout: fixed;
                    }
            
                    * {
                        line-height: inherit;
                    }
            
                    a[x-apple-data-detectors='true'] {
                        color: inherit !important;
                        text-decoration: none !important;
                    }
            
                    table,
                    td {
                        color: #000000;
                    }
            
                    #u_body a {
                        color: #0000ee;
                        text-decoration: underline;
                    }
                </style>
            
                <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
            
            </head>
            
            <body class="clean-body u_body"
                style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
                <table id="u_body"
                    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%"
                    cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            
            
            
                                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                    <div class="u-row"
                                        style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                                        <div
                                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                            <div class="u-col u-col-100"
                                                style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                <div style="height: 100%;width: 100% !important;">
                                                    <div
                                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                        <table style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:4px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                                            border="0">
                                                                            <tr>
                                                                                <td style="padding-right: 0px;padding-left: 0px;"
                                                                                    align="center">
            
                                                                                    <img align="center" border="0"
                                                                                        src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png"
                                                                                        alt="Image" title="Image"
                                                                                        style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 171.68px;"
                                                                                        width="171.68" />
            
                                                                                </td>
                                                                            </tr>
                                                                        </table>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                        <table style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <div
                                                                            style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                            <p style="font-size: 14px; line-height: 140%;"><strong>T
                                                                                    H A N K S&nbsp; &nbsp;F O R&nbsp; &nbsp;S I G N
                                                                                    I N G&nbsp; &nbsp;U P&nbsp; WITH&nbsp; ACCUSOFT
                                                                                    EXPENSE MANAGER!</strong></p>
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                        <table style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <div
                                                                            style="font-size: 14px; color: #e5eaf5; line-height: 120%; text-align: center; word-wrap: break-word;">
                                                                            <p style="font-size: 14px; line-height: 120%;"><span
                                                                                    style="font-size: 26px; line-height: 31.2px;"><strong><span
                                                                                            style="line-height: 31.2px;">Verify Your
                                                                                            E-mail Address </span></strong>
                                                                                </span>
                                                                            </p>
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
                                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                    <div class="u-row"
                                        style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                        <div
                                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                            <div class="u-col u-col-100"
                                                style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                <div style="height: 100%;width: 100% !important;">
                                                    <div
                                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                        <table id="naam" style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <div
                                                                            style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                                                            <p style="font-size: 14px; line-height: 160%;"><span
                                                                                    style="font-size: 22px; line-height: 35.2px;">Hi,
                                                                                    <span style="line-height: 22.4px;"><span
                                                                                            style="line-height: 22.4px;"><strong><span
                                                                                                    style="color: #3598db; line-height: 22.4px; text-transform: uppercase;">${query.name}</span></strong>
                                                                                        </span>
                                                                                    </span>
                                                                                </span>
                                                                            </p>
                                                                            <p style="font-size: 14px; line-height: 160%;"><span
                                                                                    style="font-size: 18px; line-height: 28.8px;">You're
                                                                                    almost ready to get started. Please click on the
                                                                                    button below to verify your email address and
                                                                                    enjoy exclusive features with us! </span></p>
                                                                            <p
                                                                                style="font-size: 14px; line-height: 160%; text-align: right;">
                                                                                <span
                                                                                    style="font-size: 14px; line-height: 22.4px;">Developer
                                                                                    - Jai Kishan kumar</span></p>
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                        <table id="emailbtn" style="font-family:'Cabin',sans-serif;"
                                                            role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                            border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
                                                                        <div align="center">
                                                                            <a href="${process.env.frontEndUrl}/api/verify?id=${query._id}"
                                                                                target="_blank" class="v-button"
                                                                                style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #ff6600; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:65%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                                                                <span
                                                                                    style="display:block;padding:14px 44px 13px;line-height:120%;"><span
                                                                                        style="font-size: 16px; line-height: 19.2px;"><strong><span
                                                                                                style="line-height: 19.2px; font-size: 16px;">VERIFY
                                                                                                YOUR EMAIL</span></strong>
                                                                                    </span>
                                                                                </span>
                                                                            </a>
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                        <table style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <div
                                                                            style="font-size: 14px; line-height: 130%; text-align: center; word-wrap: break-word;">
                                                                            <p style="line-height: 130%; font-size: 14px;"><span
                                                                                    style="font-size: 18px; line-height: 23.4px;">Thanks</span>
                                                                            </p>
                                                                            <p style="line-height: 130%; font-size: 14px;"><span
                                                                                    style="font-size: 18px; line-height: 23.4px;">Accusoft-Expense
                                                                                    Management</span></p>
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
            
            
            
            
                                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                    <div class="u-row"
                                        style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                                        <div
                                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                            <div class="u-col u-col-100"
                                                style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                <div style="height: 100%;width: 100% !important;">
                                                    <div
                                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                        <table style="font-family:'Cabin',sans-serif;" role="presentation"
                                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;"
                                                                        align="left">
            
                                                                        <div align="center">
                                                                            <table align="left" border="0" cellspacing="0"
                                                                                cellpadding="0" width="32" height="32"
                                                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top">
                                                                                        <td align="left" valign="middle"
                                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                            <a href="https://facebook.com/"
                                                                                                title="Facebook" target="_blank">
                                                                                                <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png"
                                                                                                    alt="Facebook" title="Facebook"
                                                                                                    width="32"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table align="left" border="0" cellspacing="0"
                                                                                cellpadding="0" width="32" height="32"
                                                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top">
                                                                                        <td align="left" valign="middle"
                                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                            <a href="https://linkedin.com/"
                                                                                                title="LinkedIn" target="_blank">
                                                                                                <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png"
                                                                                                    alt="LinkedIn" title="LinkedIn"
                                                                                                    width="32"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table align="left" border="0" cellspacing="0"
                                                                                cellpadding="0" width="32" height="32"
                                                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top">
                                                                                        <td align="left" valign="middle"
                                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                            <a href="https://instagram.com/"
                                                                                                title="Instagram" target="_blank">
                                                                                                <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png"
                                                                                                    alt="Instagram"
                                                                                                    title="Instagram" width="32"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table align="left" border="0" cellspacing="0"
                                                                                cellpadding="0" width="32" height="32"
                                                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top">
                                                                                        <td align="left" valign="middle"
                                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                            <a href="https://youtube.com/"
                                                                                                title="YouTube" target="_blank">
                                                                                                <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/youtube.png"
                                                                                                    alt="YouTube" title="YouTube"
                                                                                                    width="32"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table align="left" border="0" cellspacing="0"
                                                                                cellpadding="0" width="32" height="32"
                                                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top">
                                                                                        <td align="left" valign="middle"
                                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                            <a href="https://email.com/"
                                                                                                title="Email" target="_blank">
                                                                                                <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/email.png"
                                                                                                    alt="Email" title="Email"
                                                                                                    width="32"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                    </div>
            
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
            
            
            
            
            
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row"
                        style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                        <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <div class="u-col u-col-100"
                                style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                <div style="height: 100%;width: 100% !important;">
                                    <div
                                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0"
                                            cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;"
                                                        align="left">
            
                                                        <div
                                                            style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                                            <p style="font-size: 14px; line-height: 180%;"><span
                                                                    style="font-size: 16px; line-height: 28.8px;">Copyrights ©
                                                                    Accusoft All Rights Reserved</span></p>
                                                        </div>
            
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                </td>
                </tr>
                </tbody>
                </table>
            </body>
            
            </html>`
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    res.status(201).json({
                        message: "Email sent, check your inbox",
                    })
                    console.log('Email sent:', info.response);
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error
        })
    }
}

module.exports = emailmiddleware;
