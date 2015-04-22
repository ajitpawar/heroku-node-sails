/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  // OAuth2.0
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param

  google: function(req, res) {

    if(req.header('Referer')){
      req.session.backURL = req.header('Referer') || '/';
    }

    passport.authenticate('google',
      {
        failureRedirect: req.session.backURL,
        scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read'],
        hd: 'pawar.ca'
      },

    function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          res.view('500');    // error occurred in google oauth login process
          return;
        }

        res.redirect(req.session.backURL || '/');    // rediect on successful login
        return;
      });
    })(req, res);
  },

};
