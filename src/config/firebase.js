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
        const downloadUrl = await response[0].getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        })
        console.log("File uploaded successfully, download url: ", downloadUrl[0]);
    
        await fs.unlinkSync(localFilePath);
        return downloadUrl[0];
    } catch (error) {
        console.log("Error while uploading image on firebase: ", error.message);
        fs.unlinkSync(localFilePath) // remove the file from the local storage as the upload got failed

    }

}

const deleteFromFirebaseStorageBucket = async (firebaseStorageBucketFolderPath, username) => {
    try {
        if (!firebaseStorageBucketFolderPath) {
            throw new ApiError(400, "Invalid Url of firebase asset")
        }
        if (!username) {
            throw new ApiError(400, "username not found, therefore could not be deleted")
        }
        const response = await bucket.deleteFiles({
            prefix: `${firebaseStorageBucketFolderPath}/${username}`
        })
        console.log("Files deleted successfully");
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