const mongo = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const log = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    refreshTokens: {
        type: [String],
        default: [],
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        index: true
    },
    phone: {
        type: Number,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
    googleId: {
        type: String,
        default: "",
        index: { sparse: true }
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    temptoken: {
        type: String,
        default: "",
        index: { sparse: true }  // fast lookup for password-reset flows
    },
    otp: {
        code: { type: String, default: "" },
        expiresAt: { type: Date, default: null },
        otpType: { type: String, enum: ['verify_email', 'reset_password', 'none'], default: 'none' }
    },
    imgsrc: {
        type: String,
        default: ""
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ['admin', 'user', 'demo'],
        default: 'user'
    },
    isverified: {
        type: Boolean,
        default: false
    },
    cookieConsent: {
        status: {
            type: String,
            enum: ['accepted', 'essential_only', 'none'],
            default: 'none'
        },
        consentDate: {
            type: Date,
            default: null
        }
    },
    lastActivity: {
        type: Date,
        default: null
    }
}, { timestamps: true })

// Hash password before saving in Mongoose 9 (only if password exists and modified)
log.pre("save", async function () {
    const user = this;
    if (!user.password || !user.isModified("password")) {
        return;
    }
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
});

log.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isadmin
        },
            process.env.jwt_token,
            {
                expiresIn: "30d",
            }
        );
    } catch (error) {
        console.error(error);
    }
};


log.methods.checkpassword = async function (hello) {
    // console.log(hello,this.password );
    try {
        return bcrypt.compare(hello, this.password);
    } catch (error) {
        console.error(error);
    }
};

const user = new mongo.model("user", log);
module.exports = user;