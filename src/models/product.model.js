import { Schema } from "mongoose";
import mongoose from "mongoose";

const schemaOptions = {
    toJson: true, 
    toObject: true, 
    timesstamps: true
}

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
        brand: {
            type: String, 
            required: [true, "Please enter the brand name"], 
            trim: true
        },
        price: {
            type: Number, 
            required: [true, "Please enter the product price"]
        }, 
        description: {
            type: String, 
            required: [true, "Please enter the product details"]
        }, 
        category: {
            type: String, 
            required: [true, "Category is required"]
        },
        countInStocks: {
            type: Number, 
            required: [true, "Enter the quantity in stock"]
        },
        averageRating: {
            type: Number, 
            min: [1, "rating must be atleast 1"], 
            max: [10, "rating cannot be more than 10"]
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
    schemaOptions
)

// Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

productSchema.pre("remove", async function (next) {
    await this.model("Review").deleteMany(
        {
            product: this._id
        }
    )
    next();
});

productSchema.virtual("Reviews", {
    ref: "Review", 
    localField: "_id" , 
    foreignField: "product", 
    justOne: false,
})

export const Product = mongoose.model("Product", productSchema)