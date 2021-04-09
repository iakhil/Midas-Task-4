const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function(req, res) {
  res.render('landing');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));


var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
  res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secure"
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/secure',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/secure');
  });
