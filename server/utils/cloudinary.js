const cloudinary = require('cloudinary').v2
const user = require('../modals/login_schema');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dusxlxlvm',
    api_key: '214119961949842',
    api_secret: "kAFLEVAA5twalyNYte001m_zFno"
});

const cloudnary = async (req, res, next) => {
    const newimagefilepath = req.file.path;
    const userid = req.body.user;
    const old = req.body.image
    // console.log(req.file);
    try {
        cloudinary.uploader.upload(newimagefilepath, async (error, result) => {
            const imageurl = result.secure_url;
            // console.log(imageurl);
            if (result) {
                const upd = await user.findByIdAndUpdate({ _id: userid }, { imgsrc: imageurl });
                if (upd) {
                    const hu = old.split('/');
                    const lastwala = hu[hu.length - 1].split('.')[0];
                    await cloudinary.uploader.destroy(lastwala, (error, result) => {
                        if (result) {
                            const isdelete = fs.unlinkSync(newimagefilepath);
                            req.body.newurl = imageurl;
                            next();
                        }
                    })

                } else {
                    res.status(500).json({
                        success: false,
                        message: "Something went wrong during updating"
                    })
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: "Something went wrong during file uploading"
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "something went wrong"
        });
    }

}
module.exports = cloudnary;