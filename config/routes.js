
module.exports.routes = {

  /************
   	Note: according to policies/sessionAuth.js and config/policies.js,
      if user session is not authenticated then they get redirected to "/login"
    ************/

  '/' : {
  	view: 'home',
  	locals: {layout: null}
  },

  '/403' : {view: '403'},
  '/upload/Public'  : 'UploadController.public',
  '/upload/Private' : 'UploadController.private',

};
