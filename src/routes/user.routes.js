import { Router } from "express";
import { verifyJWT } from "../middlwares/auth.middleware.js";
import { upload } from "../middlwares/multer.middleware.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateProfilePicture} from "../controllers/userAuth.js";

const router = Router();

router.route("/register").post(
    upload.single(
        "profilePicture"
    ),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(
    // verifyJWT,
     changeCurrentPassword)
router.route("current-user").get(verifyJWT, getCurrentUser)
router.route("/upate/account-details").patch(verifyJWT, updateAccountDetails)
router.route("/update/profile-picture").patch(verifyJWT, upload.single("profilePicture"), updateProfilePicture)
// user profile
// order history
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/verify-email").post(verificationEmail);

export default router