(function() {
  var app = angular.module('videoClipper', ['video-directives'])
  .factory('videoInfo', [function() {
    return {
      "srcfile" : "/media/sintel_trailer-480.mp4",
      "activeThumb" : 0,
      "playall" : false,
      "state" : "player",
      "videoMarkers" : {
        "buttoncopy" : [
          "make clip",
          "edit clip"
        ]
      },
      "videoMakeclip" : {
        "buttoncopy" : [
          "start",
          "stop",
          "add",
          "delete",
          "save"
        ],
        "markers" : [
          {
            "num": 0,
            "label": "stop",
            "style": {'left' : '-6%'}
          },
          {
            "num": 1,
            "label": "start",
            "style": {'left' : '-6%'}
          }
        ]
      },
      "videoThumbs" : {
        "buttoncopy" : [
          "play all",
          "select all",
          "export data",
          "show playlist"
        ]
      },
      "clips" : [
        {
          "num": 0,
          "name": "full video",
          "start": 0,
          "stop": 0,
          "duration": 0,
          "tags": [],
          "style": {'left' : '-6%'}
        }
      ]
    }
  }]);

  app.controller("ClipperController", ['$scope','$window','videoInfo', function($scope,$window,videoInfo){
    var clipper = this;
    // set full video source and loading status
    clipper.isMakeclipOpen = false;
    clipper.clips = videoInfo.clips;
    
    clipper.tempClip = {
      "num": videoInfo.clips.length,
      "name": "clip" + videoInfo.clips.length,
      "start": 0,
      "stop": 0,
      "duration": 0,
      "tags": [],
      "style": {'left' : '-6%'}
    };

    clipper.isActive = function(num) {
      return videoInfo.activeThumb === num;
    };

    clipper.setActive = function(num) {
      $scope.$broadcast('setActive', num);
    };

    clipper.isLoading = function() {
      return clipper.loading;
    }

    clipper.reset = function () {
      clipper.tempClip = {
        "num": videoInfo.clips.length,
        "name": "clip" + videoInfo.clips.length,
        "start": 0,
        "stop": 0,
        "duration": 0,
        "tags": [],
        "style": {'left' : '-6%'}
      };

    };

    clipper.delete = function () {
      clipper.reset();
      // remove active clip
      if ((videoInfo.activeThumb > 0) && (videoInfo.state == 'edit')) {
        videoInfo.clips.splice(videoInfo.activeThumb, 1);
        videoInfo.activeThumb = 0;
      }
      clipper.scrollToTop();
      videoInfo.state = "player";
    };

    clipper.errorCheck = function() {
      // if not an error reset temp clip, close view
      if (clipper.tempClip.start < clipper.tempClip.stop) {
        clipper.reset();
        clipper.isMakeclipOpen = false;
        clipper.scrollToTop();
        videoInfo.state = "player";
      } 
    };

    clipper.removeTag = function(num) {
      clipper.tempClip.tags.splice(num, 1);
    };

    clipper.scrollToTop = function() {
      $window.scrollTo(0, 0);
    };

    clipper.setState = function(state) {
      videoInfo.state = state;
      if (state == "edit") {
        //set temp clip to active clip
        clipper.tempClip = videoInfo.clips[videoInfo.activeThumb];
      }
    };
    
  }]);

})();
