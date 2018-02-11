'use strict';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export async function verifyJWT(token) {
  if(process.env.NODE_ENV === 'test') {
    return await User.findOne({}, '-password');
  } else {
    return await new Promise((resolve, reject) => {
      jwt.verify(String(token).replace('Bearer ', ''), config.secrets.session, function(err, decoded) {
        if(err) {
          reject(err);
        }

        resolve(decoded);
      });
    });
  }
}

export function signToken(data) {
  return jwt.sign({
    _id: data._id,
    email: data.email,
    username: data.username,
    createdOn: data.createdOn
  }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if(!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
