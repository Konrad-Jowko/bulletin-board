const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/* PASSPORT CONFING FOR LOGIN VIA GOOGLE */
passport.use(new GoogleStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

// Serialize user when saving to session
passport.serializeUser((user, serialize) => {
  serialize(null, user);
});

// Deserialize user when reading from session
passport.deserializeUser((obj, deserialize) => {
  deserialize(null, obj);
});
