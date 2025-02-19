import { Schema, mongo } from "mongoose";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt, { verify } from 'jsonwebtoken'
import crypto from "crypto"

const userSchema = new Schema(
    {
        uid: {
            type: String
        },
        username: {
            type: String, 
            required: [true, 'Please enter your username'], 
            trim: [true, 'Please enter a valid username'], 
            unique: true, 
            minlength: 3,
            maxlength: 20,
            lowercase: true, 
            index: true
// Indexes are special data structures that store a small portion of the collection's data set in an easy-to-traverse form.
// read this : https://www.mongodb.com/docs/manual/indexes/
        }, 
        email: {
            type: String, 
            required: [true, 'Please enter your email'],
            trim: true,
            unique: true,
            lowercase: true
        }, 
        fullName: {
            type: String, 
            required: [true, 'Please enter your full name'], 
            trim: true, 
            index: true
        }, 
        password: {
            type: String, 
            required: [true, 'Please enter your password'], 
            trim: true
        }, 
        contactNumber: {
            type: String, 
            // required: [true, 'Please enter your contact number'],
            trim: true
        }, 
        profilePicture: {
            type: String, 
        }, 
        role: {
            type: String, 
            default: "user"
        },
        address: {
            type: String, 
            // required: [true, 'Please enter your address'], 
            trim: true
        },
        cart: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'Product'
            }
        ], 
        orderHistory: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'Product'
            }
        ], 
        refreshToken: {
            type: String,
        }, 
        verify: {
            type: Boolean, 
            default: false
        }
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hashSync(this.password, 10);
    next();
})

userSchema.pre("remove", async function (next) {
    this.model('Review').deleteMany(
        {
            userId: this._id
        }
    )
    this.model("Order").deleteMany(
        {
            userId: this._id
        }
    )
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    jwt.sign(
        {
            // payload
                _id: this._id, 
                username: this.username, 
                email: this.email, 
                fullName: this.fullName
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
} 

userSchema.methods.generateRefreshToken = async function () {
    jwt.sign(
        {
            //payload
            _id: this._id
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
    

export const User = mongoose.model("User", userSchema)