const user = require('../modals/login_schema')
const ledmodel = require('../modals/ledger_schema')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const sendemail = require('../utils/sendemail')
const jwt = require('jsonwebtoken');
const removePhotoBySecureUrl = require('../utils/cloudinaryremove');
const asyncHandler = require('../utils/asyncHandler')

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
    const msg = `Hi <b>${query.name}</b>,
    <br>
    This mail is regards to your Forget password request. 
    <br><br>
    <a href="${process.env.frontEndUrl}/resetpassword/${temptoken}" style="display: inline-block; padding: 4px 20px; background-color: #007bff; color: #fff; text-decoration: none; letter-spacing: 1px;; border-radius: 5px;">Reset Password</a>
    `
    await sendemail(query.email, 'Forget Password || Accusoft', msg);
    // await addJobToQueue(query.email, 'Forget Password || Battlefiesta', msg);
    // await addtoqueue(query.email, 'Forget Password', msg)

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
    const msg = `Hi <b>${req.user.name}</b>,
    <br>
    This mail is regards to your password reset request. 
    <br><br>
    <a href="${process.env.frontEndUrl}/resetpassword/${temptoken}" style="display: inline-block; padding: 4px 20px; background-color: #007bff; color: #fff; text-decoration: none; letter-spacing: 1px;; border-radius: 5px;">Reset Password</a>
    `
    await sendemail(query.email, 'Password Reset || Accusoft', msg);

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
      })
    }
    // return res.status(201).send(`<html><h2> Hi ${query.name} , Email Verified Successfully, <button onclick="location.href = 'https://frontend-exp-man.vercel.app';">Login Now</button> </h2></html>`)
    return res.status(201).send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signup Successful</title>
        
          <meta name="author" content="Codeconvey" />
          <style>
            @import url('https://fonts.googleapis.com/css?family=Raleway:400,500,600,700,800,900');
        
        
        
            html {
              box-sizing: border-box;
            }
        
            *,
            *:before,
            *:after {
              box-sizing: inherit;
              padding: 0;
              margin: 0;
            }
        
            article,
            header,
            section,
            aside,
            details,
            figcaption,
            figure,
            footer,
            header,
            hgroup,
            main,
            nav,
            section,
            summary {
              display: block;
            }
        
            body {
              background: #e5e5e5 none repeat scroll 0 0;
              color: #222;
              font-size: 100%;
              line-height: 24px;
              margin: 0;
              padding: 0;
              font-family: "Raleway", sans-serif;
              width: 100%;
             min-height: calc(100vh - var(--navheight));
             display: flex;
             justify-content: center;
              align-items: center;
            }
        
            a {
              font-family: "Raleway", sans-serif;
              text-decoration: none;
              outline: none;
            }
        
            a:hover,
            a:focus {
              color: #373e18;
            }
        
            section {
              width: 100%;
              padding-bottom: 3em;
            }
        
            h2 {
              color: #1a0e0e;
              font-size: 26px;
              font-weight: 700;
              margin: 0;
              line-height: normal;
              text-transform: uppercase;
            }
        
            h2 span {
              display: block;
              padding: 0;
              font-size: 18px;
              opacity: 0.7;
              margin-top: 5px;
              text-transform: uppercase;
            }
        
            #float-right {
              float: right;
            }
        
            #naam{
                text-transform: uppercase;
            }
        
            .rt-heading {
              margin: 0 auto;
              text-align: center;
            }
        
            .Scriptcontent {
              line-height: 24px;
            }
        
            
        
        
            .rt-container {
              margin: 0 auto;
              padding-left: 12px;
              padding-right: 12px;
            }
        
            .rt-row:before,
            .rt-row:after {
              display: table;
              line-height: 0;
              content: "";
            }
        
            .rt-row:after {
              clear: both;
            }
        
            [class^="col-rt-"] {
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              -o-box-sizing: border-box;
              -ms-box-sizing: border-box;
              padding: 0 15px;
              min-height: 1px;
              position: relative;
            }
        
            #card {
              position: relative;
              width: 320px;
              display: block;
              margin: 40px auto;
              text-align: center;
              font-family: 'Source Sans Pro', sans-serif;
            }
        
            #upper-side {
              padding: 2em;
              background-color: #8BC34A;
              display: block;
              color: #fff;
              border-top-right-radius: 8px;
              border-top-left-radius: 8px;
            }
        
            #checkmark {
              font-weight: lighter;
              fill: #fff;
              margin: -3.5em auto auto 20px;
            }
        
            #status {
              font-weight: lighter;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-size: 1em;
              margin-top: -.2em;
              margin-bottom: 0;
            }
        
            #lower-side {
              padding: 2em 2em 5em 2em;
              background: #fff;
              display: block;
              border-bottom-right-radius: 8px;
              border-bottom-left-radius: 8px;
            }
        
            #message {
              margin-top: -.5em;
              color: #757575;
              letter-spacing: 1px;
            }
        
            #contBtn {
              position: relative;
              top: 1.5em;
              text-decoration: none;
              background: #8bc34a;
              color: #fff;
              margin: auto;
              padding: .8em 3em;
              -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
              -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
              box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
              border-radius: 25px;
              -webkit-transition: all .4s ease;
              -moz-transition: all .4s ease;
              -o-transition: all .4s ease;
              transition: all .4s ease;
            }
        
            #contBtn:hover {
              -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
              -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
              box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
              -webkit-transition: all .4s ease;
              -moz-transition: all .4s ease;
              -o-transition: all .4s ease;
              transition: all .4s ease;
            }
        
        
            @media (min-width: 768px) {
              .rt-container {
                width: 750px;
              }
        
              [class^="col-rt-"] {
                float: left;
                width: 49.9999999999%;
              }
        
              .col-rt-6,
              .col-rt-12 {
                width: 100%;
              }
        
            }
        
            @media (min-width: 1200px) {
              .rt-container {
                width: 1170px;
              }
        
              .col-rt-1 {
                width: 16.6%;
              }
        
              .col-rt-2 {
                width: 30.33%;
              }
        
              .col-rt-3 {
                width: 50%;
              }
        
              .col-rt-4 {
                width: 67.664%;
              }
        
              .col-rt-5 {
                width: 83.33%;
              }
            }
        
            @media only screen and (min-width:240px) and (max-width: 768px) {
        
              .scriptnav ul {
                text-align: center;
              }
        
              .scriptnav ul {
                margin-top: 12px;
              }
        
              #float-right {
                float: none;
              }
        
            }
          </style>
        
        </head>
        
        <body>
        
          <section>
            <div class="rt-container">
              <div class="col-rt-12">
                <div class="Scriptcontent">
                  <div id='card' class="animated fadeIn">
                    <div id='upper-side'>
                      <?xml version="1.0" encoding="utf-8"?>
                      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                      <svg version="1.1" id="checkmark" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve">
                        <path d="M131.583,92.152l-0.026-0.041c-0.713-1.118-2.197-1.447-3.316-0.734l-31.782,20.257l-4.74-12.65
            c-0.483-1.29-1.882-1.958-3.124-1.493l-0.045,0.017c-1.242,0.465-1.857,1.888-1.374,3.178l5.763,15.382
            c0.131,0.351,0.334,0.65,0.579,0.898c0.028,0.029,0.06,0.052,0.089,0.08c0.08,0.073,0.159,0.147,0.246,0.209
            c0.071,0.051,0.147,0.091,0.222,0.133c0.058,0.033,0.115,0.069,0.175,0.097c0.081,0.037,0.165,0.063,0.249,0.091
            c0.065,0.022,0.128,0.047,0.195,0.063c0.079,0.019,0.159,0.026,0.239,0.037c0.074,0.01,0.147,0.024,0.221,0.027
            c0.097,0.004,0.194-0.006,0.292-0.014c0.055-0.005,0.109-0.003,0.163-0.012c0.323-0.048,0.641-0.16,0.933-0.346l34.305-21.865
            C131.967,94.755,132.296,93.271,131.583,92.152z" />
                        <circle fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" cx="109.486" cy="104.353"
                          r="32.53" />
                      </svg>
                      <h3 id='status'>
                        Email Verified Successfully 
                      </h3>
                    </div>
                    <div id='lower-side'>
                      <p id='message'>
                        Congratulations <span id='naam'> ${query.name} </span>, your account has been successfully Verified.
                      </p>
                      <a href="${process.env.frontEndUrl}" id="contBtn">Continue SignIn</a>
                    </div>
                  </div>
        
                </div>
              </div>
            </div>
          </section>
        
        
        </body>
        
        </html>`)
  } catch (error) {
    return res.status(500).json({
      message: "User Email not  verified",
      error: error
    })
  }
}

module.exports = { signup, passreset, setpassword, refreshToken, logout, checkmail, photo, login, updateuserdetail, verify };