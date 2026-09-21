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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    temptoken: {
        type: String,
        default: ""
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
    lastActivity: {
        type: Date,
        default: null
    }
}, { timestamps: true })

// secure the password
log.pre("save", async function () {
    // console.log(this);
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        console.log(error);
        next(error);
    }
})

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