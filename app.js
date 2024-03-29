//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app =  express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});



userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password']}); //we just want to get password to save to autenticate the personal informatio
//we encrypt the password values (encodded)the password values to save data of users


// encrypt will be saved as we save the data some where in the code and encrypt will be decoded if we use find
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", async function(req,res){
    
    try{
        const newUser = new User({
            email: req.body.username,
            password:req.body.password
        });
        await newUser.save();
        res.render("secrets");  //only when user is registered then only we will render to secrets page
    }  
    
    catch(error){
        console.log(error);
    };   
});

app.post("/login",async function(req,res){

    try{
        const username = req.body.username;
        const password = req.body.password;

    const foundUser=await User.findOne({email: username});
    if(foundUser){
        if(foundUser.password ===password){
            res.render("secrets")
        }
    }
    }
    catch(error){
       console.log(error);
    }
});


app.listen(3000,function(req,res){
    console.log("server connected to port 3000");
})