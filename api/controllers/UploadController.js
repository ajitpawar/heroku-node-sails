/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var crypto = require('crypto');
var AWS = require('aws-sdk');

/**************************
  AWS S3 config
*****************************/
  var configAWSPublic = {
    bucket : "pawar-public",
    accesskey : 'AKIAJGSWPKNHWLJ5A2DA',
    secret : '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',
    region : 'us-east-1'
  };

  var configAWSPrivate = {
    bucket : "pawar-private",
    accesskey : 'AKIAI4INPNGNP3TQOKBQ',
    secret : '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',
    region : 'us-east-1'
  };



/**************************
  Controller
*****************************/
module.exports = {

  // index page
  index: function (req, res){
      res.view({user: req.user});
  },

  // public S3 bucket
  public: function (req, res)
  {
    var config = getAWSConfig("Public");
  	var s3Cred = buildS3(config);
    var plupload = buildPlupload(s3Cred);

    getS3Folders(config,req,res,s3Cred,plupload);
  },


  // private S3 bucket
  private: function (req, res)
  {
    // not authenticated
  	if(!req.isAuthenticated()){
      var data = {plupload:null, s3Credentials:null, notAuthenticated: true};
      var folders = {mssg:"You are not logged in", data:null};
      res.send({user:req.user, data:data, folders:folders});
      return;
  	}

    // authenticated
    var config = getAWSConfig("Private");
    var s3Cred = buildS3(config);
    var plupload = buildPlupload(s3Cred);

    getS3Folders(config,req,res,s3Cred,plupload);
  }

};



/**************************
  Helper functions
*****************************/
function getAWSConfig(privacy){
  var config = (privacy == 'Private') ? configAWSPrivate : configAWSPublic;
  return config;
}


function getS3Folders(config,req,res,s3Cred,plupload){

    AWS.config.region = config.region;
    AWS.config.credentials =
      new AWS.Credentials({accessKeyId: config.accesskey, secretAccessKey: config.secret});

    var data = {plupload: plupload, s3Credentials: s3Cred, notAuthenticated: false};
    var folders = {mssg: null, data: null};
    var s3 = new AWS.S3();
    var params = {Bucket: config.bucket, Delimiter: '/'};

    // get "folders" from S3
    s3.listObjects(params, function(err, d) {
      if (err) folders.mssg = err.message;
      else{
        folders.data = d.CommonPrefixes;
      }

      res.send({user:req.user, data:data, folders:folders});

    });
}


// helper function to create AWS S3 policy
function buildS3(config){

	var date = new Date();

	var s3Policy = {
	"expiration": "" + (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()) + "T" + (date.getHours() + 1) + ":" + (date.getMinutes()) + ":" + (date.getSeconds()) + "Z",
	"conditions": [
		  {"bucket": config.bucket},
		  {"acl": "public-read"},
		  ["starts-with", "$key", ""],
		  ["starts-with", "$Content-Type", ""],
		  ["starts-with", "$name", ""],
		  ["starts-with", "$Filename", ""]
		]
	};

	var base64 = new Buffer(JSON.stringify(s3Policy)).toString('base64');
	var sign = crypto.createHmac("sha1", config.secret).update(base64).digest("base64");

	var s3Credentials = {
	    s3PolicyBase64: base64,
	    s3Signature: sign,
	    s3Key: config.accesskey,
	    s3Bucket: config.bucket
	};

	return s3Credentials;
}



// build the plupload object
function buildPlupload(s3Credentials){

  var plup = {

    runtimes : 'html5,flash',
    url : 'http://'+s3Credentials.s3Bucket+'.s3.amazonaws.com/',
    multipart: true,
    multipart_params: {
      'key': '${filename}', 		// use filename as a key
      'Filename': '${filename}', 	// adding this to keep consistency across the runtimes
      'acl': 'public-read',
      'Content-Type': 'binary/octet-stream',
      'AWSAccessKeyId' : s3Credentials.s3Key,
      'policy': s3Credentials.s3PolicyBase64,
      'signature': s3Credentials.s3Signature
    },

    // Resize not recommended with S3, since it will force Flash runtime
    // into mode with NO PROGRESS INDICATION
    // resize : {width : 1024, height : 768, quality : 100},

    flash_swf_url : '/js/Moxie.swf',
    file_data_name: 'file',

    filters : {
      max_file_size : '100mb',
      mime_types: [
        {title : "All files", extensions : getExtensions()}
      ]
    },

    preinit : {
      UploadFile: null
    },

    init : {
      UploadComplete: null,
      Error: null
    }
  }

  return plup;
}


function getExtensions() {
	var exts = [];
	for(key in mime){
		exts.push(key);
	}
	return exts.join();
}


var mime = {
    '3gp' : 'video/3gpp',
    'avi' : 'video/x-msvideo',
    'bmp' : 'image/bmp',
    'djv' : 'image/vnd.djvu',
    'djvu' : 'image/vnd.djvu',
    'dmg' : 'application/octet-stream',
    'doc' : 'application/msword',
    'dvi' : 'application/x-dvi',
   	'flv' : 'video/x-flv',
    'gif' : 'image/gif',
    'gz' : 'application/x-gzip',
    'ico' : 'image/x-icon',
    'jpeg' : 'image/jpeg',
    'jpg' : 'image/jpeg',
    'latex' : 'application/x-latex',
    'm3u' : 'audio/x-mpegurl',
    'm4a' : 'audio/mp4a-latm',
    'm4p' : 'audio/mp4a-latm',
    'm4u' : 'video/vnd.mpegurl',
    'm4v' : 'video/x-m4v',
    'mid' : 'audio/midi',
    'midi' : 'audio/midi',
    'mov' : 'video/quicktime',
    'mp2' : 'audio/mpeg',
    'mp3' : 'audio/mpeg',
    'mp4' : 'video/mp4',
    'mpeg' : 'video/mpeg',
    'mpg' : 'video/mpeg',
    'mpga' : 'audio/mpeg',
    'ogg' : 'application/ogg',
    'ogv' : 'video/ogv',
    'pdf' : 'application/pdf',
    'png' : 'image/png',
    'ppt' : 'application/vnd.ms-powerpoint',
    'qt' : 'video/quicktime',
    'qti' : 'image/x-quicktime',
    'qtif' : 'image/x-quicktime',
    'ra' : 'audio/x-pn-realaudio',
    'ram' : 'audio/x-pn-realaudio',
    'rm' : 'application/vnd.rn-realmedia',
    'swf' : 'application/x-shockwave-flash',
    'tar' : 'application/x-tar',
    'txt' : 'text/plain',
    'wav' : 'audio/x-wav',
    'webm' : 'video/webm',
    'wmv' : 'video/x-ms-wmv',
    'xls' : 'application/vnd.ms-excel',
    'zip' : 'application/zip'
  };

