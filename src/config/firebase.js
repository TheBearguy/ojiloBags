// var admin = require("firebase-admin");
import { log } from "console";
import admin from "firebase-admin"
import fs from 'fs'
import { ApiError } from "../utils/ApiError";

const { FieldPath, AggregateQuerySnapshot } = require("firebase-admin/firestore");

var serviceAccount = require("../utils/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://bagsecom-bb883.appspot.com"
});

const bucket = admin.storage().bucket();

const uploadOnFirebaseStorageBucket = async (localFilePath, firebaseStorageBucketFolderPath) => {
    try {
        if (!localFilePath) {
            return null
        }
        // upload the file on firebase storage bucket
        const  response = await bucket.upload(localFilePath, {
            destination: firebaseStorageBucketFolderPath
        })
        // file has been uploaded on firebase storage bucket
        console.log(response);
    
        // get the firebase url of the image
        // response.url or signedUrl
    
        await fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Error while uploading image on firebase: ", error.message);
        fs.unlinkSync(localFilePath) // remove the file from the local storage as the upload got failed

    }

}

const deleteFromFirebaseStorageBucket = async (firebaseStorageBucketFolderPath, imageId) => {
    try {
        if (!firebaseStorageBucketFolderPath) {
            throw new ApiError(400, "Invalid Url of firebase asset")
        }
        if (!imageId) {
            throw new ApiError(400, "ImageId not found, therefore could not be deleted")
        }
        const response = await bucket.deleteFiles({
            prefix: `${firebaseStorageBucketFolderPath}/${imageId}`
        })
        console.log(response);
        return response;
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "Error occurred while deleting files from firebase"
        )
    }
}

export {
    uploadOnFirebaseStorageBucket, 
    deleteFromFirebaseStorageBucket
}