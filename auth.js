const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
app.use(bodyParser.urlencoded( { extended: true}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/secure",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Your name is: " + profile.displayName);
    const dispName = profile.displayName;


   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
function isLoggedin(req, res, next)
{
  if ( req.user) {
    next();
  }
  else {
    res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());
app.get('/', function(req, res) {
  res.render('/landing');
})

app.get('/failed', function(req, res) {
  res.send("Login Unsuccessful.");
})

app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
