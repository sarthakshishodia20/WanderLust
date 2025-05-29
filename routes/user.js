const express=require("express");
const router=express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware");
const userController=require("../controllers/user");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// router.get("/signup",userController.renderSignupForm)

// router.post("/signup",wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:'login',
}),userController.login);

router.route("/logout").get(userController.logout);

module.exports=router;
