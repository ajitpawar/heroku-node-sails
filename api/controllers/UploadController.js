/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var crypto = require('crypto');

module.exports = {

  index: function (req, res) {
    res.view({user: req.user});
  },

  // public S3 bucket
  public: function (req, res) {
    var data = {"plupload": null,
                "s3Credentials": null,
                "notAuthenticated": false
    };

  	var bucket = "pawar-public";
  	var accesskey = 'AKIAJGSWPKNHWLJ5A2DA';
	  var secret = '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';

  	var s3Cred = buildS3(bucket,accesskey,secret);
    data.s3Credentials = s3Cred;
    data.plupload = buildPlupload(s3Cred);
    res.send({user: req.user, data: data});
  },


  // private S3 bucket
  private: function (req, res) {
  	 var data = {"plupload": null,
				        "s3Credentials": null,
				        "notAuthenticated": false
			};

  	if(!req.isAuthenticated()){		// server-side check for user auth
  		data.notAuthenticated = true;
  	}
  	else{
  		var bucket = "pawar-private";
  		var accesskey = 'AKIAI4INPNGNP3TQOKBQ';
		  var secret = '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';

  		var s3Cred = buildS3(bucket,accesskey,secret);
  		data.s3Credentials = s3Cred;
  		data.plupload = buildPlupload(s3Cred);
  	}

  	res.send({user: req.user, data: data});
  }

};




// helper function to create AWS S3 policy
function buildS3(bucket,accesskey,secret){

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



// build the plupload object
function buildPlupload(s3Credentials){

  var plup =
  {
    runtimes : 'html5,flash',
    url : 'http://'+s3Credentials.s3Bucket+'.s3.amazonaws.com/',
    multipart: true,
    multipart_params: {
      'key': '${filename}', 		// use filename as a key
      'Filename': '${filename}', 	// adding this to keep consistency across the runtimes
      'acl': 'public-read',
      'Content-Type': 'image/jpeg',
      'AWSAccessKeyId' : "'"+s3Credentials.s3Key+"'",
      'policy': "'"+s3Credentials.s3PolicyBase64+"'",
      'signature': "'"+s3Credentials.s3Signature+"'"
    },

    // Resize not recommended with S3, since it will force Flash runtime
    // into mode with NO PROGRESS INDICATION
    // resize : {width : 1024, height : 768, quality : 100},

    // optional, but better be specified directly
    file_data_name: 'file',
    filters : {
      max_file_size : '5mb',
      mime_types: [
        {title : "Image files", extensions : "jpg,jpeg,png,gif"}
      ]
    },

    // Flash settings
    flash_swf_url : '/js/Moxie.swf'
  }

  return plup;
}


