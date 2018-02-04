import passport from 'passport';
import jwt from 'jsonwebtoken';
import PassportLocal from 'passport-local';
import User from '../models/user';

var LocalStrategy = PassportLocal.Strategy;
export var secretKey = 'nuinodeblog';

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password' // this is the virtual field on the model
}, function(username, password, done) {
  return localAuthenticate(User, username, password, done);
}));

function localAuthenticate(User, username, password, done) {
  User.authenticate(username, password, function(authError, authenticated) {
    if(authError) {
      return done(authError);
    }
    if(!authenticated) {
      return done(null, false, { message: 'รหัสผ่านไม่ถูกต้อง' });
    } else {
      return done(null, authenticated);
    }
  });
}

export async function verifyJWT(token) {
  if(process.env.NODE_ENV === 'test') {
    return await User.findOne({}, '-password');
  } else {
    return await new Promise((resolve, reject) => {
      jwt.verify(String(token).replace('Bearer ', ''), secretKey, function(err, decoded) {
        if(err) {
          reject(err);
        }

        resolve(decoded);
      });
    });
  }
}

export function signToken(data) {
  return jwt.sign(data, secretKey, {
    expiresIn: 60 * 60 * 5
  });
}
