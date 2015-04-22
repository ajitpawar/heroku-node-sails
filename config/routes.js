
module.exports.routes = {

  /************
   	Note: according to policies/sessionAuth.js and config/policies.js,
      if user session is not authenticated then they get redirected to "/login"
    ************/

  '/' : {
    controller : 'home'
  },

  '/403' : {
  	view : '403'
  }

};
