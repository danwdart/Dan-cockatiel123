const passport = require('passport');
const {Strategy} = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = app => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: true   
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne(
            {
              email
            }
          );

          if (!user) {
            return done(null, false);
          }

          try {
            if (!(await bcrypt.compare(password, user.password))) {
              return done(null, false);
            }
          } catch (err) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  app.post('/users/signin',
    (req, res, next) => 
      passport.authenticate(
        'local',
        (err, user) => {
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
      )(req, res, next)
  );
};