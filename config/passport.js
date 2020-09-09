const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

// 1. setup passport strategy
passport.use(
  new LocalStrategy(
    // 2. customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // 3. authenticate user
    (req, username, password, done) => {
      User.findOne({ where: { email: username } }).then((user) => {
        if (!user)
          return done(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤'),
          );
        if (!bcrypt.compareSync(password, user.password))
          return done(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！'),
          );

        return done(null, user);
      });
    },
  ),
);

// 4. serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON(); // 此處與影片示範不同
    return done(null, user);
  });
});

module.exports = passport;
