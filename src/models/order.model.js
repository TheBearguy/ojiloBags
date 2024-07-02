import { Schema, mongo } from "mongoose";
import mongoose from "mongoose";

const orderItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product"
    }, 
    qty: {
        type: Number, 
        required: [true, "Please enter the quantity of the item"]
    }, 
    
});

const paymentSchema = new Schema({
    id: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        required: true, 
        enum: ["pending", "completed", "failed"]  // Example enum
    }, 
    paymentMethod: {
        type: String, 
        required: [true, "Please select a payment method"], 
        enum: ["credit_card", "paypal", "bank_transfer"]  // Example enum
    }, 
    isPaid: {
        type: Boolean, 
        default: false
    },
    paidAt: {
        type: Date, 
        default: Date.now, 
    }, 

})

const shippingSchema = new Schema({
    address: {
        type: String, 
        require: [true, "Please enter the local address"]
    }, 
    city: {
        type: String, 
        required: [true, "Please enter teh city"]
    }, 
    country: {
        type: String, 
        required: [true, "enter the country"]
    },
    pincode: {
        type: String, 
        required: [true, "enter the pincode"]
    }, 
    isDelivered: {
        type: Boolean, 
        default: false
    }, 
    deliveredAt: {
        type: Date, 
    }, 

})

const orderSchema = new Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    orderItems: [orderItemSchema],  
    payment: paymentSchema, 
    shipping: shippingSchema,
    itemsPrice: {
        type: Number, 
        required: [true, "Pleasea enter the sum of prices of all the items "]
    }, 
    taxPrice: {
        type: Number, 
        required: [true, "Pleasea enter the taxes "]        
    }, 
    shippingPrice: {
        type: Number, 
        required: [true, "Pleasea enter the shipping price "]
    }, 
    totalPrice: {
        type: Number, 
        required: [true, "Pleasea enter the total price to be paid"]
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    }
})

export const Order = mongoose.model("Order", orderSchema)