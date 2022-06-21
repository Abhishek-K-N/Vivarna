const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const User=require("../model/users");
const saltRound=10;
require("dotenv").config();
const Text=process.env.text;
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;

router.get('/hello',(req,res)=>{
    res.send("hello")
});
router.get("/login", (req, res)=>{
    res.render("login");
});
router.get("/signUp", (req, res)=>{

    res.render("signup");
});
router.post("/signup", (req, res)=>
{
    // const users= new User({name: req.body.Name, email: req.body.emailId, username: req.body.userName, password:""});
    const {Name, userName, emailId, Password, confirmPassword}= req.body;
    User.findOne({email: emailId}, (err, user)=>{
        if(user){
            console.log("A user with this E-Mail Address is already present. Please try another Email-ID");
        }
    });
    User.findOne({username: userName}, (err, user)=>{
        if(user){
            console.log("This username is already used. Try some thing else!")
        }
    });
    if(Password===confirmPassword)
    {
        const newUser= new User({
            name: Name,
            email: emailId,
            username: userName,
            password: Password
        });
        bcrypt.genSalt(10, (err, salt)=>
        {
            bcrypt.hash(Password, salt, (err, hash)=>
            {
                if(err){console.log(err);}
                else{
                    newUser.password=hash;
                    newUser.save((err)=>{
                        if(err){console.log(err);}
                        else{
                            res.redirect("/question");
                        }
                    })
                }
            })
        })
    }
    else{
        console.log("Re-type your password");
    }
});
passport.use(new LocalStrategy(
    function(username, password, done)
    {
        User.findOne({username: username}, (err, user)=>
        {
            if(err){return (done(err));}
            if(!user){return (done(null, false));}
            bcrypt.compare(Text, hash, (err, result)=>
            {
                if(err){console.log(err);}
                if(result)
                {done(null, true);}else{
                    done(null, false);
                }
            })
        })
    }
));
passport.serializeUser((user, done)=>
{
    done(null, user.id);
});
passport.deserializeUser((user, done)=>
{
    User.findById(id, (err, user)=>
    {done(err, user)});
});
router.post("/login", (req, res)=>
{
    
    console.log("hello");
    passport.authenticate("local", {
        failureRedirect:"/login"
    }, (req, res)=>{res.redirect("/");})
});

module.exports=router;