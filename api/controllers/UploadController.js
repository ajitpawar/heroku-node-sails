/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var crypto = require('crypto');


module.exports = {

  index: function (req, res) {

	var bucket = "pawar";
	var accessKeyId = 'AKIAJGSWPKNHWLJ5A2DA';
	var secret = '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';
  	var _date = new Date();

	var s3Policy = {
	"expiration": "" + (_date.getFullYear()) + "-" + (_date.getMonth() + 1) + "-" + (_date.getDate()) + "T" + (_date.getHours() + 1) + ":" + (_date.getMinutes()) + ":" + (_date.getSeconds()) + "Z",
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
	    s3Key: accessKeyId,
	    s3Bucket: bucket
	};

	// render view
    res.view({s3Credentials: s3Credentials});					// index.ejs by default
  }
};



