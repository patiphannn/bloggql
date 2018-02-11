import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, username, password, done) {
  User.findOne({
    username: username.toLowerCase()
  }).exec()
    .then(async user => {
      if(!user) {
        return done(null, false, {
          message: 'Email นี้ยังไม่ถูกลงทะเบียนในระบบ'
        });
      }

      user.authenticate(password, function(authError, authenticated) {
        if(authError) {
          return done(authError);
        }
        if(!authenticated) {
          return done(null, false, { message: 'รหัสผ่านไม่ถูกต้อง' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User/*, config*/) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' // this is the virtual field on the model
  }, function(username, password, done) {
    return localAuthenticate(User, username, password, done);
  }));
}
