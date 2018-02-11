import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}).exec()
      .then(user => {
        if(user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });
        user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    profileFields: [
      'displayName',
      'emails',
      'picture.type(large)'
    ]
  }, function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          profileImageURL: [profile.photos[0].value],
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });

        user.save()
          .then(user => {
            passport.serializeUser((user, done) => {
              done(null, user);
            });

            passport.deserializeUser((user, done) => {
              done(null, user);
            });

            done(null, user);
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
