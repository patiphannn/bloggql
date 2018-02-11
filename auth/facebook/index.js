'use strict';

import express from 'express';
import passport from 'passport';
import {signToken, setTokenCookie} from '../auth.service';

var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie)
  .get('/token', passport.authenticate('facebook-token'), function (req, res) {
  	let token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);

  	if(token) {
  		res.status(200).json({ token });
  	}else{
  		res.status(401);
  	}
  });

export default router;
