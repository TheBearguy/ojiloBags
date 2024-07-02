import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema({
    categoryName: {
        type: String, 
        reuired: [true, "Category name is needed"]
    }
}, {
    timestamps: true
})

export const Category = mongoose.model("Category", categorySchema)