/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var crypto = require('crypto');


module.exports = {

  // upload to public S3 bucket
  index: function (req, res) {

  	var bucket = "pawar-public";
  	var accesskey = 'AKIAJGSWPKNHWLJ5A2DA';
	var secret = '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';

	var s3Credentials = getS3Credentials(bucket,accesskey,secret);
    res.view({
    	s3Credentials: s3Credentials,
    	user: req.user
    });
  },



  // upload to private S3 bucket
  private: function (req, res) {

  	if(!req.isAuthenticated()){		// if not logged in, but still trying to upload
  		res.redirect('/upload');	// to private S3 bucket, then just redirect
  		return;
  	}
  	else{
  		var bucket = "pawar-private";
  		var accesskey = 'AKIAI4INPNGNP3TQOKBQ';
		var secret = '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';

  		var s3Credentials = getS3Credentials(bucket,accesskey,secret);
	    res.view({
	    	s3Credentials: s3Credentials,
	    	user: req.user
	    });
  	}
  }

};


// helper function to create AWS S3 policy

function getS3Credentials(bucket,accesskey,secret){

	var date = new Date();

	var s3Policy = {
	"expiration": "" + (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()) + "T" + (date.getHours() + 1) + ":" + (date.getMinutes()) + ":" + (date.getSeconds()) + "Z",
	"conditions": [
		  {"bucket": bucket},
		  {"acl": "public-read"},
		  ["starts-with", "$key", ""],
		  ["starts-with", "$Content-Type", "image/"],
		  ["starts-with", "$name", ""],
		  ["starts-with", "$Filename", ""]
		]
	};

	var base64 = new Buffer(JSON.stringify(s3Policy)).toString('base64');
	var sign = crypto.createHmac("sha1", secret).update(base64).digest("base64");

	var s3Credentials = {
	    s3PolicyBase64: base64,
	    s3Signature: sign,
	    s3Key: accesskey,
	    s3Bucket: bucket
	};

	return s3Credentials;
}



