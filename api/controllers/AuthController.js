/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  index: function(req, res) {
    res.view({user: req.user});         // if left empty, index.ejs rendered by default
  },

  // OAuth2.0
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function(req, res) {
    passport.authenticate('google',
      { failureRedirect: '/login',
        scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read']
        // hd: 'example.com'
      },

    function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          //console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

};
