const passport=require("passport");
const User=require("../models/user");

module.exports.renderLoginForm=((req,res)=>{
    res.render("users/login", { searchQuery: '' });
});

module.exports.login=((req,res)=>{
    req.flash("success","Welcome user");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
});


module.exports.renderSignupForm=((req,res)=>{
    res.render("users/signup", { searchQuery: '' });
});
module.exports.signup=(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    });
    // req.flash("success","Welcome to WanderLust");
    // res.redirect("/listings");
    }catch(e){
        req.flash("error","A user with this credentials is already registered");
        res.redirect("/signup");
    }
});

module.exports.logout=((req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","You are logged Out");
        res.redirect("/listings");
    })
});