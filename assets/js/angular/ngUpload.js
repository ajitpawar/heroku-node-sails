
/*******************************
  Controller for /upload
********************************/

 // load modules
  var myApp = angular.module('myApp', ['ngRoute','ngTouch','ngSanitize']);

 // angular controller
 myApp.controller('ngUpload', function($scope, $http, $timeout)
 {
    // set default values
    $scope.privacy = 'Public';

    // build dropdown
    $scope.dropvalues = ["default"];

    // submit button listener
    $scope.submit = function() {
      $scope.dropvalues.push($scope.formvalue);
      $scope.foldername = $scope.formvalue;
    };

    // dropdown bar listener
    $scope.$watch('dropvalue', function(){
      $scope.foldername = $scope.dropvalue;
    });

    $scope.$watch('foldername', function(){
      if($scope.foldername){
        $scope.mssgType = 'success';
        $scope.mssg = "ok, your files will be uploaded to <b>"+ $scope.foldername +"</b> folder";
      }
    });

    // radio button listener
    $scope.$watch('privacy', function()
    {
      $http.get('/upload/'+$scope.privacy)
      .success(function(response) {

          if(!response.folders.mssg){
              var list = _.pluck(response.folders.data, 'Prefix');
              var listFix = _.map(list, function(e){ return _.initial(e).join(""); });
              $scope.dropvalues = _.union($scope.dropvalues, _.without(listFix, 'default'));
          }
          else {
              $scope.mssgType = 'danger';
              $scope.mssg = "<h5><b>Amazon AWS Error</b></h5>" + response.folders.mssg;
          }

          // update plupload
          $scope.notAuthenticated = response.data.notAuthenticated;
          $("#uploader").remove();

          if(response.data.notAuthenticated){
            $scope.mssgType = 'danger';
            $scope.mssg = '<h5><b>Oops! You must be logged in first</b></h5>';
            return;
          }

          // $scope.mssg=null;
          $("#static").append('<div id="uploader"></div>');
          attachListeners(response.data.plupload,$scope,$timeout,$http);
          $("#uploader").plupload(response.data.plupload);  // attach plupload
      })
      .error(function(response) {
          $scope.mssgType = 'danger';
          $scope.mssg =
          "<h5><b>Oops! Failed to load the uploader</b></h5>Server Error: "+response;
      });
    });


    function attachListeners(instance,scope,timeout,http)
    {
        instance.init.UploadComplete = function(){
          scope.mssgType = 'success';
          scope.mssg = "<h5><b>Success!</b></h5>All files uploaded successfully";
          timeout(function(){ scope.mssg=null; }, 6000);
          scope.$digest();
        }

        instance.init.Error = function(plup, args){
          scope.mssgType = 'danger';
          scope.mssg = "<h5><b>Error</b></h5>"+args.message;
          scope.$digest();
        }

        instance.preinit.UploadFile = function(plup, file){
          if(!scope.foldername){
            scope.foldername = 'default';
            scope.$digest();
          }
          plup.settings.multipart_params['key'] = scope.foldername+'/'+file.name;
        }
    }

});