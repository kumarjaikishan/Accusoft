const user = require('../modals/login_schema')
const ledmodel = require('../modals/ledger_schema')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const sendemail = require('../utils/sendemail')
const jwt = require('jsonwebtoken');
const removePhotoBySecureUrl = require('../utils/cloudinaryremove');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');
const { 
  generateVerificationOtpEmailHtml, 
  generateResetPasswordOtpEmailHtml 
} = require('../utils/emailTemplates');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// *--------------------------------------
// * User Profile pic Upload Logic
// *--------------------------------------

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none", //comment this for localHost
  maxAge: 7 * 24 * 60 * 60 * 1000
}

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      isAdmin: user.isadmin,
      name: user.name,
      email: user.email,
      userType: user.userType,
      _id: user._id.toString(),
    },
    process.env.jwt_token,
    { expiresIn: "10m" }
    // { expiresIn: "10s" }
  );
};

const generateRefreshToken = async (userobj) => {
  const newToken = jwt.sign(
    {
      userId: userobj._id,
      _id: userobj._id.toString(),
    },
    process.env.refresh_token,
    { expiresIn: "15d" }
    // { expiresIn: "25s" }
  );
  try {
    // Keep only the last 5 sessions — prevents unbounded array growth
    await user.findByIdAndUpdate(userobj._id, {
      $push: { refreshTokens: { $each: [newToken], $slice: -5 } }
    });
  } catch (error) {
    console.error('[generateRefreshToken] Failed to save refresh token:', error.message);
  }

  return newToken;
};

const photo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded.');
  }

  const oldurl = req.body.oldimage;
  const userid = req.userid;

  // Promise-based upload — avoids mixing async/await with callbacks
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(req.file.path, { folder: 'accusoft/profile' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

  const imageurl = uploadResult.secure_url;

  // Clean up local temp file (non-blocking, don't fail the request if it errors)
  fs.unlink(req.file.path, (err) => {
    if (err) console.error('[photo] Temp file cleanup failed:', err.message);
  });

  // Update user's profile picture in DB
  await user.findByIdAndUpdate(userid, { imgsrc: imageurl });

  // Remove old Cloudinary image if one existed
  if (oldurl && oldurl !== '') {
    removePhotoBySecureUrl([oldurl]).catch(err =>
      console.error('[photo] Failed to remove old image:', err.message)
    );
  }

  return res.status(201).json({
    message: 'photo updated',
    url: imageurl
  });
});

const random = async (len) => {
  const rand = 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * rand.length);
    result += rand[randomIndex];
  }
  return result;
};

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const checkmail = async (req, res, next) => {
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  if (!email) {
    return next({ status: 400, message: 'Please enter your email address' });
  }
  try {
    const query = await user.findOne({ email });
    if (!query) {
      return next({ status: 400, message: 'No account found with this email' });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.findByIdAndUpdate(query._id, {
      otp: {
        code: otpCode,
        expiresAt,
        otpType: 'reset_password'
      }
    });

    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    const msg = generateResetPasswordOtpEmailHtml({
      name: query.name,
      otp: otpCode,
      appUrl
    });
    await sendemail(query.email, 'Password Reset Code • Accusoft', msg);

    return res.status(200).json({
      message: 'Reset OTP sent to your email',
      email: query.email
    });
  } catch (error) {
    console.error('[checkmail error]:', error);
    return next({ status: 500, message: error.message || error });
  }
};

const resetPasswordWithOtp = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next({ status: 400, message: 'Email, OTP, and new password are required' });
  }
  try {
    const foundUser = await user.findOne({ email: email.toLowerCase().trim() });
    if (!foundUser) {
      return next({ status: 400, message: 'User not found' });
    }

    if (!foundUser.otp || !foundUser.otp.code || foundUser.otp.otpType !== 'reset_password') {
      return next({ status: 400, message: 'No active password reset OTP requested' });
    }

    if (new Date() > new Date(foundUser.otp.expiresAt)) {
      return next({ status: 400, message: 'OTP has expired. Please request a new one.' });
    }

    if (foundUser.otp.code !== String(otp).trim()) {
      return next({ status: 400, message: 'Invalid 6-digit OTP code' });
    }

    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(newPassword, saltRound);

    await user.updateOne(
      { _id: foundUser._id },
      { 
        password: hash_password, 
        temptoken: '', 
        otp: { code: '', expiresAt: null, otpType: 'none' } 
      }
    );

    return res.status(200).json({
      message: 'Password reset successfully! You can now sign in.'
    });
  } catch (error) {
    console.error('[resetPasswordWithOtp error]:', error);
    return next({ status: 500, message: error.message || error });
  }
};

const verifyEmailOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next({ status: 400, message: 'Email and OTP are required' });
  }
  try {
    const foundUser = await user.findOne({ email: email.toLowerCase().trim() });
    if (!foundUser) {
      return next({ status: 400, message: 'User not found' });
    }

    if (!foundUser.otp || !foundUser.otp.code || foundUser.otp.otpType !== 'verify_email') {
      return next({ status: 400, message: 'No active email verification OTP found' });
    }

    if (new Date() > new Date(foundUser.otp.expiresAt)) {
      return next({ status: 400, message: 'OTP has expired. Please click resend.' });
    }

    if (foundUser.otp.code !== String(otp).trim()) {
      return next({ status: 400, message: 'Invalid 6-digit verification code' });
    }

    await user.updateOne(
      { _id: foundUser._id },
      { 
        isverified: true, 
        otp: { code: '', expiresAt: null, otpType: 'none' } 
      }
    );

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = await generateRefreshToken(foundUser);

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, options)
      .json({
        message: "Email verified successfully!",
        token: accessToken,
        userId: foundUser._id.toString(),
        isadmin: foundUser.isadmin,
        name: foundUser.name
      });
  } catch (error) {
    console.error('[verifyEmailOtp error]:', error);
    return next({ status: 500, message: error.message || error });
  }
};

const resendOtp = async (req, res, next) => {
  const { email, type = 'verify_email' } = req.body;
  if (!email) {
    return next({ status: 400, message: 'Email is required' });
  }
  try {
    const foundUser = await user.findOne({ email: email.toLowerCase().trim() });
    if (!foundUser) {
      return next({ status: 400, message: 'User not found' });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.findByIdAndUpdate(foundUser._id, {
      otp: {
        code: otpCode,
        expiresAt,
        otpType: type
      }
    });

    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    const msg = type === 'reset_password'
      ? generateResetPasswordOtpEmailHtml({ name: foundUser.name, otp: otpCode, appUrl })
      : generateVerificationOtpEmailHtml({ name: foundUser.name, otp: otpCode, appUrl });

    const subject = type === 'reset_password' ? 'Password Reset Code • Accusoft' : 'Your Verification Code • Accusoft';
    await sendemail(foundUser.email, subject, msg);

    return res.status(200).json({
      message: 'New 6-digit OTP code sent to your email',
      email: foundUser.email
    });
  } catch (error) {
    console.error('[resendOtp error]:', error);
    return next({ status: 500, message: error.message || error });
  }
};

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "Google ID Token credential is required");
  }

  // Decode the cryptographically signed Google JWT payload
  let payload;
  try {
    payload = jwt.decode(credential);
  } catch (err) {
    throw new ApiError(400, "Invalid Google ID Token format");
  }

  if (!payload || !payload.email) {
    throw new ApiError(400, "Unable to extract email from Google credential");
  }

  const email = payload.email.toLowerCase().trim();
  const name = payload.name || payload.given_name || email.split("@")[0];
  const picture = payload.picture || "";
  const googleId = payload.sub || "";

  // Check if user already exists
  let existingUser = await user.findOne({ email });

  if (!existingUser) {
    // 1. Create new user record for first-time Google sign up
    const newUser = new user({
      name,
      email,
      imgsrc: picture,
      googleId,
      authProvider: 'google',
      isverified: true
    });
    existingUser = await newUser.save();

    // 2. Provision default initial ledgers
    const ledger1 = new ledmodel({ userid: existingUser._id.toString(), ledger: "general" });
    const ledger2 = new ledmodel({ userid: existingUser._id.toString(), ledger: "other" });
    await Promise.all([ledger1.save(), ledger2.save()]);
  } else {
    // Update avatar or link googleId if not linked
    const updates = {};
    if (!existingUser.isverified) updates.isverified = true;
    if (!existingUser.googleId) updates.googleId = googleId;
    if (!existingUser.imgsrc && picture) updates.imgsrc = picture;

    if (Object.keys(updates).length > 0) {
      existingUser = await user.findByIdAndUpdate(existingUser._id, updates, { new: true });
    }
  }

  // Issue Access & Refresh Tokens
  const accessToken = generateAccessToken(existingUser);
  const refreshToken = await generateRefreshToken(existingUser);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Google sign-in successful!",
      token: accessToken,
      userId: existingUser._id.toString(),
      isadmin: existingUser.isadmin,
      name: existingUser.name,
      userType: existingUser.userType
    });
});

const passreset = async (req, res, next) => {

  try {
    const temptoken = await random(20);
    const query = await user.findByIdAndUpdate(req.userid, { temptoken: temptoken });
    if (!query) {
      return next({ status: 400, message: "UserId is Not Valid" });
    }
    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    const resetUrl = `${appUrl}/resetpassword/${temptoken}`;
    const msg = generateResetPasswordEmailHtml({
      name: req.user.name,
      resetUrl,
      appUrl
    });
    await sendemail(query.email, 'Password Reset • Accusoft', msg);

    return res.status(200).json({
      message: 'Email sent',
      extramessage: `Email sent successfully to ${req.user.email}, Kindly check inbox or spam to proceed further. Thankyou`
    })
  } catch (error) {
    console.log(error);
    return next({ status: 500, message: error });
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ status: 400, message: "All Fields are Required" });
  }

  try {
    const isUser = await user.findOne({ email });
    if (!isUser) {
      return next({ status: 400, message: "User not found" });
    }

    if (await bcrypt.compare(password, isUser.password)) {
      const accessToken = generateAccessToken(isUser);
      const refreshToken = await generateRefreshToken(isUser);
      // console.log("generated refreshn token", refreshToken)

      const userIdString = isUser._id.toString();
      // await user.findByIdAndUpdate(isUser._id, { refreshToken });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .json({
          message: "Login Successful",
          token: accessToken,
          userId: userIdString,
          isadmin: isUser.isadmin,
          name: isUser.name
        });

    } else {
      return next({ status: 400, message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error.message);
    return next({ status: 400, message: error.message });
  }
}

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    // another method, first decode and then make indexed query
    //  let decoded;
    // try {
    //   decoded = jwt.verify(token, process.env.refresh_token);
    // } catch {
    //   return res.sendStatus(403);
    // }
    // console.log(decoded)

    const foundUser = await user.findOne({ refreshTokens: token });
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(token, process.env.refresh_token, async (err, decoded) => {
      if (err || decoded.userId !== foundUser._id.toString()) {
        return res.sendStatus(403);
      }

      // Remove old token (rotation)
      await user.updateOne(
        { _id: foundUser._id },
        { $pull: { refreshTokens: token } }
      );

      const accessToken = generateAccessToken(foundUser);

      const newRefreshToken = jwt.sign(
        {
          userId: foundUser._id,
          _id: foundUser._id.toString(),
        },
        process.env.refresh_token,
        { expiresIn: "15d" }
      );

      // Bound to last 5 refresh tokens per user (prevent unbounded growth)
      await user.updateOne(
        { _id: foundUser._id },
        { $push: { refreshTokens: { $each: [newRefreshToken], $slice: -5 } } }
      );

      return res
        .cookie("refreshToken", newRefreshToken, options)
        .status(200)
        .json({ accessToken });
    });
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  // console.log("aaya logout")
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({ message: "Already logged out" });
    }

    await user.updateOne(
      { refreshTokens: token },
      { $pull: { refreshTokens: token } }
    );

    return res
      .clearCookie("refreshToken", options)
      .status(200)
      .json({ message: "User Logged Out" });

  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
};

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const cleanEmail = email.toLowerCase().trim();
  const checkemail = await user.findOne({ email: cleanEmail });
  if (checkemail) {
    throw new ApiError(400, "Email already exists. Please sign in instead.");
  }

  // Generate 6-Digit OTP with 10 minute expiry
  const otpCode = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const query = new user({ 
    name: name.trim(), 
    email: cleanEmail, 
    phone, 
    password,
    isverified: false,
    otp: {
      code: otpCode,
      expiresAt,
      otpType: 'verify_email'
    }
  });

  const result = await query.save();
  if (result) {
    // Create initial default ledgers
    const ledger1 = new ledmodel({ userid: result._id.toString(), ledger: "general" });
    const ledger2 = new ledmodel({ userid: result._id.toString(), ledger: "other" });
    await Promise.all([ledger1.save(), ledger2.save()]);

    // Send Verification Email with 6-Digit OTP
    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    const msg = generateVerificationOtpEmailHtml({
      name: result.name,
      otp: otpCode,
      appUrl
    });

    await sendemail(result.email, 'Your Verification Code • Accusoft', msg);

    return res.status(201).json({
      message: "Account created! Verification OTP sent to your email",
      email: result.email,
      requiresVerification: true
    });
  }
});

const updateuserdetail = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { name, phone } = req.body;
  if (!name || !phone) {
    return next({ status: 400, message: "All Fields are Required" });
  }

  const query = await user.findByIdAndUpdate({ _id: req.userid }, { name, phone })
  if (query) {
    return res.status(200).json({
      message: "Profile Detail Updated Successfully"
    })
  }

})

const updateCookieConsent = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !['accepted', 'essential_only'].includes(status)) {
    throw new ApiError(400, 'Invalid cookie consent status');
  }

  await user.findByIdAndUpdate(req.userid, {
    cookieConsent: {
      status,
      consentDate: new Date()
    }
  });

  return res.status(200).json({
    message: 'Cookie consent recorded successfully',
    status
  });
});

const verify = async (req, res) => {
  try {
    const query = await user.findByIdAndUpdate({ _id: req.query.id }, { isverified: true });

    if (!query) {
      return res.status(400).json({
        message: "UserId is not Valid"
      });
    }

    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    return res.status(200).send(generateVerificationSuccessHtml({
      name: query.name,
      appUrl
    }));
  } catch (error) {
    return res.status(500).json({
      message: "User Email not verified",
      error: error.message || error
    });
  }
};

module.exports = { 
  signup, 
  passreset, 
  resetPasswordWithOtp, 
  verifyEmailOtp, 
  resendOtp, 
  googleAuth,
  refreshToken, 
  logout, 
  checkmail, 
  photo, 
  login, 
  updateuserdetail, 
  updateCookieConsent, 
  verify 
};