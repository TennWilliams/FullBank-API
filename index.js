const express  = require('express');
const app      = express();
const cors     = require('cors');
const mongoose = require('mongoose');
//var dal     = require('./dal.js');
app.use(express.json());
const bcrypt = require("bcryptjs");

const jwt=require("jsonwebtoken");
const JWT_SECRET= "thmhidnwnifn()ayfn693dkd0677nf11gjsnaxb49gjdh30?90[]567"; 

const mongoUrl="mongodb+srv://tennwilliams917:Maliyah21@cluster0.lhltver.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{
    useNewUrlParser:true
}).then(()=>{console.log("connected to database");})
.catch(e=>console.log(e));

// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

require("./userDetails");

//Create User API
const User = mongoose.model("UserInfo");
app.post("/CreateAccount", async (req, res) => {
    const {name, email, password} = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try{
        const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
            name,
            email,
            password:encryptedPassword,
            balance:100
        });
        res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user=await User.findOne({email});
    if(!user) {
        return  res.json({ error: "User Not Found"})
        }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({email: user.email}, JWT_SECRET);
        if(res.status(201)){
            return res.json({ status: "ok", data: token});
        } else {
            return res.json({error: "error"});
        }
    }
    res.json({ status: "error", error: "Invalid Passwod" });
});

// User Data
app.post("/userData", async (req, res) => {
    const {token} = req.body;
    try{
        const user=jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({ email: useremail})
            .then((data) => {
                res.send({ status: "ok", data: data});
        })
        .catch((error) => {
            res.send({ status:"error", data: error});
        });
    } catch (error) { }
    });

//balance
app.put("/balance", async (req, res) => {
    const {token, balance} = req.body;
    console.log("token", token)
    console.log("balance", balance)
    try{
        const user=jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        
        User.findOneAndUpdate({ email: useremail},
                     { $set: {balance: userbalance}})
            
        } catch (error) {}
        });

//alldata
app.get("/alldata", async (req, res) => {
  //  const {token} = req.body;
    try{
        const allUser= await User.find({});
        res.send({ status: "ok", data: allUser});
    } catch (error) {
        console.log(error);
    }
    });

/* create user account
app.get('/account/create/:name/:email/:password', function (req, res) {
     res.send ({
        name:       req.params.name, 
        email:      req.params.email, 
        password:   req.params.password
       });
});

// login user
app.get('/account/login/:email/:password', function (req, res) {
    res.send({
        email:     req.params.email,
        password:  req.params.password
    });
});

//all accounts
app.get('/all', function (req, res) {
    res.send({
        name:      'peter',
        email:     'peter@mit.edu',
        password:  'secret'
    });
});

// make deposit
app.get('/account/login/:email/:password', function (req, res) {
    res.send({
        email:     req.params.email,
        balance:   req.params.balance
    });
});

// make withdraw
app.get('/account/login/:email/:password', function (req, res) {
    res.send({
        email:     req.params.email,
        balance:   req.params.balance
    });
});

// get user balance
app.get('/account/login/:email/:password', function (req, res) {
    res.send({
        email:     req.params.email,
        balance:   req.params.balance
    });
});*/

var port = 3000;
app.listen(port);
console.log('Running on port: ' + port);