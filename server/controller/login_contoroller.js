const user = require('../modals/login_schema')
const ledmodel = require('../modals/ledger_schema')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const sendemail = require('../utils/sendemail')
const jwt = require('jsonwebtoken');
const removePhotoBySecureUrl = require('../utils/cloudinaryremove');
const asyncHandler = require('../utils/asyncHandler');
const { generateResetPasswordEmailHtml, generateVerificationSuccessHtml } = require('../utils/emailTemplates');

cloudinary.config({
  cloud_name: 'dusxlxlvm',
  api_key: '214119961949842',
  api_secret: "kAFLEVAA5twalyNYte001m_zFno"
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
    await user.findByIdAndUpdate(userobj._id, {
      $push: { refreshTokens: newToken }
    });

  } catch (error) {
    console.log(erro)
  }



  return newToken;
};

const photo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded.'
    });
  }
  // console.log("from final",req.body);
  const oldurl = req.body.oldimage;
  const userid = req.userid;
  try {
    await cloudinary.uploader.upload(req.file.path, { folder: 'accusoft/profile' }, async (error, result) => {
      // console.log(error, result);
      if (error) {
        return res.status(500).json({
          message: error
        });
      }

      const imageurl = result.secure_url;
      // console.log("photo upload ho gaya", imageurl);

      fs.unlink(req.file.path, (err => {
        if (err) {
          console.log(err);
          return res.status(500).json("error occured while deleting file");
        }
        //   getFilesInDirectory(); 
        // }
      }));

      const query = await user.findByIdAndUpdate({ _id: userid }, { imgsrc: imageurl });
      // console.log("url updateing", query);
      if (oldurl != "") {
        let arraye = [];
        arraye.push(oldurl);
        await removePhotoBySecureUrl(arraye);
      }

      res.status(201).json({
        message: "photo updated",
        url: imageurl
      })


    })
  } catch (error) {
    res.status(501).json({
      message: error
    })
  }

}

const random = async (len) => {
  const rand = 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * rand.length);
    result += rand[randomIndex];
  }
  return result;
};

const checkmail = async (req, res, next) => {
  console.log(req.body);
  if (req.body.email == "") {
    return next({ status: 400, message: 'Please send Email' });
  }
  try {
    const query = await user.findOne({ email: req.body.email });
    if (!query) {
      return next({ status: 400, message: 'Email not Found' });
    }
    const temptoken = await random(20);
    await user.findByIdAndUpdate(query._id, { temptoken: temptoken });
    const appUrl = process.env.frontEndUrl || 'https://accusoft.battlefiesta.in';
    const resetUrl = `${appUrl}/resetpassword/${temptoken}`;
    const msg = generateResetPasswordEmailHtml({
      name: query.name,
      resetUrl,
      appUrl
    });
    await sendemail(query.email, 'Reset Your Password • Accusoft', msg);

    return res.status(200).json({
      message: 'Reset Link sent to Email'
    })
  } catch (error) {
    console.log(error);
    return next({ status: 500, message: error });
  }
}

const setpassword = async (req, res, next) => {
  const token = req.query.token;
  const password = req.body.password;
  //  console.log(token,password);
  try {
    const query = await user.findOne({ temptoken: token });

    if (!query) {
      return next({ status: 400, message: 'This link has been Expired' });
    }

    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, saltRound);
    // console.log(hash_password);
    await user.updateOne({ _id: query._id }, { password: hash_password, temptoken: '' })
    return res.status(200).json({
      message: 'Password Updated Successfully'
    })
  } catch (error) {
    console.log(error);
    return next({ status: 500, message: error });
  }
}

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

      await user.updateOne(
        { _id: foundUser._id },
        { $push: { refreshTokens: newRefreshToken } }
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
  // console.log(req.body);
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return next({ status: 400, message: "all fields are required" });
  }
  const checkemail = await user.findOne({ email });
  if (checkemail) {
    return next({ status: 400, message: "Email Already Exists" });
  }
  const query = new user({ name, email, phone, password });
  const result = await query.save();
  if (result) {
    const ledger1 = new ledmodel({ userid: result._id.toString(), ledger: "general" });
    const ledger2 = new ledmodel({ userid: result._id.toString(), ledger: "other" });
    await ledger1.save();
    await ledger2.save();
    next();
  }
})

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

module.exports = { signup, passreset, setpassword, refreshToken, logout, checkmail, photo, login, updateuserdetail, verify };