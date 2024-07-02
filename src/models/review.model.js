import { Schema } from "mongoose";
import mongoose from "mongoose";

const reviewSchema = new Schema({
    title: {
        type: String, 
        required: [true, "A review should have a title"],
        trim: true,
        maxlength: [100, "A title should not be this long"]
    }, 
    text: {
        type: String, 
        trim: true, 
        minlength: [4, "Please write your experience in detail"]
    }, 
    rating: {
        type: Number, 
        min: 1, 
        max: 5, 
        required: [true, "Please rate the product between 1 and 5"], 
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        requried: true
    }
})

// Use method on individual documents if you want to manipulate the individual document like adding tokens etc. Use the statics approach if you want to query the whole collection.

reviewSchema.statics.getRating = async function (productId) {
    const ratingObj = await this.aggregate[
        {
            $match: {
                productId: productId
            }
        }, 
        {
            $group: {
                _id: "$productId", 
                averageRating: {
                    $avg: "$rating"
                }
            }
        }
    ]

    try {
            await this.model('Product').findByIdAndUpdate(
                'productId', 
                {
                    averageRating: ratingObj[0].averageRating,
                }
            );
    } catch (error) {
        console.log("Error in averageRating: ", error);        
    }

}

reviewSchema.post("save", async function () {
    this.constructor.getRating(this.productId)
});

reviewSchema.pre("remove", async function () {
    this.constructor.getRating(this.productId)
});

export const Review = mongoose.model("Review", reviewSchema)