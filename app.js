require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

UserSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'], additionalAuthenticatedFields: ['email'] });

const User = mongoose.model("User", UserSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
-
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("Secrets");
    }
  });
});
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
User.findOne({email:username}, function (err,founduser){
if(err){
    console.log(err);
}else{
 if (founduser) {
  if (founduser.password === password) {
    res.render("secrets");
  } else {
    console.log("Incorrect password");
    // Handle incorrect password
  }
} else {
  console.log("User not found");
  // Handle non-existing user
}
}
});
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
