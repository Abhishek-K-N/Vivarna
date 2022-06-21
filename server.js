const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport= require("passport");
const User=require("./model/users");
const Question= require("./model/question");
const Answer=require("./model/answer");
const bcrypt= require("bcrypt");
const { text } = require("body-parser");
const saltRound=10;
require("dotenv").config();
const Text=process.env.text;

// const setOfQues=[];
// const homeContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const app=express();
app.set("view engine", "ejs");
app.use(session(
    {
        secret: "I love gintama",
        resave: false,
        saveUninitialized: false,
        cookie: {secure: true}
    }
));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(process.cwd() + '/public'));
app.use("/user",require('./routes/auth'));

mongoose.connect("mongodb://localhost:27017/VivarnaDB");

app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

const answer= Answer(
    {
        answer: "",
        likes: 0

    }
);


app.get("/", (req, res)=>{
    Question.find({}, (err, setOfQues)=>
    {
        if(err)
        {console.log(err);}
        else{
            res.render("home", {setOfQues: setOfQues})
        }
    })
});
app.get("/about", (req, res)=>{
    res.render("about");
});

// app.get("/login", (req, res)=>{
//     res.render("login");
// });
// app.get("/signUp", (req, res)=>{

//     res.render("signup");
// });
app.get("/question", (req, res)=>{
    if(req.isAuthenticated)
    {
        console.log("Authenicated");
        res.render("question");
    }
    else{
        res.redirect("/signup");
    }
});
app.post("/question", (req, res) =>{
    const question= new Question({
        title: req.body.quesTitle,
        body: req.body.quesBody,
        tags: req.body.quesTags,
        answers: answer
    });
    question.save();
    res.redirect("/");
});

app.post("/answer", (req, res)=>{
    const questionID=req.body.quesID;
    // console.log(questionID);
    Question.findById(questionID, (err, question)=>
    {
        if(err){console.log(err);}
        else{
            // console.log(req.body.answer);
            question.answers.push({
                answer:req.body.answer,
                likes:"0"
            });
            question.save();
            res.redirect("/answer/"+questionID);
        }
    })
});

app.get("/answer/:id", (req, res)=>{
    console.log(req.params.id);
    Question.findById(req.params.id, (err, question)=>
    {
        if(err){console.log(err);}
        else{
            res.render("answer", {question: question});
    }
    })
});

app.post("/likes/:id", (req, res)=>
{
    Answer.findById(req.params.id, (err, ans)=>{
        if(err){console.log(err);}
        else{
            ans.likes +=1;
            ans.save();
            console.log(ans.likes);
        }
    })
});



app.listen(3000, ()=>{console.log("Server started on port 3000")});
