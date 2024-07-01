import { Schema, mongo } from "mongoose";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const ownerSchema = new Schema(
    {
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
            required: [true, 'Please enter your contact number'],
            trim: true
        }, 
        profilePicture: {
            type: String, 
        }, 
        productsAdded: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'Product'
            }
        ]
    }
)

ownerSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hashSync(this.password, 10);
    next();
})

ownerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

ownerSchema.methods.generateAccessToken = async function () {
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

ownerSchema.methods.generateRefreshToken = async function () {
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

export const Owner = mongoose.model("OwnuserSchema
userSchema
userSchema
userSchemaer", ownerSchema)