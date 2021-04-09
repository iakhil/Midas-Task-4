require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function(req, res) {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));


var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/secure', (req, res) => {
  if(userProfile)
  {
    //If user is authenticated, acquire user's profile picture, name and render this.
  res.render('secure', {user: userProfile.displayName, imgurl: userProfile._json.picture});
}
else 
{
  // If the user is not logged in, render this.
  res.render("unauth");
}
if(req.session == null)
{
  res.send("Log in again.")
}
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
app.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy(function(er) {
    if(er)
    {
      console.log(er); 
    }
    req.logout();
  res.redirect('/');
  })
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secure",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/blog', function(req, res) {
  //Render the blog.
  res.render("blog");
})

app.get('/contacts', function(req, res) {
  //Render contacts page.
  res.render("contacts");
});

app.get('/auth/google',

  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/secure',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    //Redirect to secure route if login is successful.
    res.redirect('/secure');
  });


















// //jshint esversion:6
// require('dotenv').config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const cookieSession = require("cookie-session");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');
// const app = express();
// app.use(express.static("public"));
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(session({
//   secret: "roadmaster",
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

// const userSchema = new mongoose.Schema ({
//   email: String,
//   password: String,
//   googleId: String,
//   secret: String
// });

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

// const User = new mongoose.model("User", userSchema);

// passport.use(User.createStrategy());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/secure",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log("Your name is: " + profile.displayName);


//    User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
// app.post("/auth/google", function(req, res)
// {
//   console.log("The name is: " + dispName);
//   res.render("secure", {name: dispName});
// });

// app.get("/", function(req, res) { 
//   res.render("landing");
// });

// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile"] })

// );
// app.get("/Contacts", function(req, res)
// {
// res.render("contacts");
// });
// app.get("/auth/google/secure",
//   passport.authenticate('google', { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect to secure. 
//     console.log("In auth: " + req.user)
//     res.redirect("/secure");
//   });

// // app.get("/auth/google/secure", function(req, res) {
// // res.render("secure");
// // });

// app.get("/secure", function (req, res) {
 
//  console.log(req.user);
//   res.render("secure");

//  //  console.log(req.user);
//  //  if(req.user) {
    
//  //    res.render("secure");
//  //  }

//  // else 
 
//  //  {
//  //    res.send("Access denied.")
//  //  }

// });

// app.get("/redirected", function(req, res)
// {
//   res.render("redirected");
// });

// app.get("/login", function(req, res){
//   res.render("login");
// });

// app.get("/register", function(req, res){
//   res.render("register");
// });

// app.get("/landing", function(req, res) {
//   res.render("landing");
// })

// app.get("/secrets", function(req, res){
//   User.find({"secret": {$ne: null}}, function(err, foundUsers){
//     if (err){
//       console.log(err);
//     } else {
//       if (foundUsers) {
//         res.render("secrets", {usersWithSecrets: foundUsers});
//       }
//     }
//   });
// });

// app.get("/submit", function(req, res){
//   if (req.cookies.isAuthenticated()){
//     res.redirect("/secure");
//   } else {
//     res.redirect("/login");
//     console.log("Unsuccssful. Try again.")
//   }
// });

// app.post("/submit", function(req, res){
//   const submittedSecret = req.body.secret;

// //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
//   // console.log(req.user.id);

//   User.findById(req.user.id, function(err, foundUser){
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         foundUser.secret = submittedSecret;
//         foundUser.save(function(){
//           res.redirect("/landing");
//         });
//       }
//     }
//   });
// });

// app.get("/logout", function(req, res){
//   req.session = null;
//   req.logout();
//   res.redirect("/");
// });

// app.post("/register", function(req, res){

//   User.register({username: req.body.username}, req.body.password, function(err, user){
//     if (err) {
//       console.log(err);
//       res.redirect("/register");
//     } else {
//       passport.authenticate("local")(req, res, function(){
//         res.redirect("/landing");
//       });
//     }
//   });

// });

// app.post("/login", function(req, res){

//   const user = new User({
//     username: req.body.username,
//     password: req.body.password
//   });

//   req.login(user, function(err){
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function(){
//         res.redirect("/landing");
//       });
//     }
//   });

// });
// app.get('/logout', (req, res) => {
//     req.session = null;
//     req.logout();
//     res.redirect('/');
// })
// app.listen(3000, function() {
//   console.log("Server started on port 3000.");
// });
