const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = app => {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: true   
    },
    (username, password, done) => User.findOne(
      { email: username },
      (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user || !user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      }
    )
  ));

  app.post('/users/signin',
    (req, res, next) => 
      passport.authenticate(
        'local',
        (err, user, info) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(400).json(
              {
                status: 'fail',
                data: {
                  user: 'Invalid credentials.'
                }
              }
            );
          }
          req.login(user, err => {
            if (err) {
              return next(err);
            }
            return res.status(200).json(
              {
                status: 'success',
                data: {
                  user
                }
              }
            );
          });
        }
      )
  );
};