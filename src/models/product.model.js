import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String, 
            required: [true, "Please enter the product name"],
        }, 
        image: {
            type: String, 
            required: [true, "Please upload the product Image"],
        }, 
        price: {
            type: Number, 
            required: [true, "Please enter the product price"]
        }, 
        description: {
            type: String, 
            required: [true, "Please enter the product details"]
        }, 
        discountPrice: {
            type: Number, 
            default: 0
        }, 
        bgColor: {
            type: String, 
            required: [true, "Please enter the bg color for the product card"]
        },
        panelColor: {
            type: String, 
            required: [true, "Please enter the panel color for the product card"]
        }, 
        textColor: {
            type: String, 
            required: [true, "Please enter the text color for the product card"]
        }
    }, 
    {timestamps: true}
)

export const Product = mongoose.model("Product", productSchema)