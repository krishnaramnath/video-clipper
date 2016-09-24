
(function(){
    var app = angular.module('video-directives', []);

    app.directive("videoMarkers", function() {
      return {
        restrict: 'E',
        templateUrl: "video-markers.html",
        controller: ['$scope','videoInfo', function($scope,videoInfo) {
          var markers = this;
          markers.buttoncopy = videoInfo.videoMarkers.buttoncopy;
          markers.clips = videoInfo.clips;
          $scope.$on('initialload', markers.positionMarkers);

          markers.positionMarkers = function() {
            var i = 0,
              lgth = markers.clips.length,
              pct = "",
              mrkrCtrCorrect = 6;
            for (i=0; i<lgth; i++) {
              pct = ((100*videoInfo.clips[i].start/videoInfo.clips[0].duration) - mrkrCtrCorrect) + '%';
              videoInfo.clips[i].style =  {'left' : pct};
            };
            markers.clips = videoInfo.clips;
          }
        }],
        controllerAs: "markers"
      };
    });

    app.directive("videoMakeclip", function() {
      return {
        restrict: 'E',
        templateUrl: "video-makeclip.html",
        controller: ['$scope','videoInfo', function($scope,videoInfo) {
          var makeclip = this;
          makeclip.mrkrCtrCorrect = 6;
          makeclip.buttoncopy = videoInfo.videoMakeclip.buttoncopy;
          makeclip.markers = videoInfo.videoMakeclip.markers;
          makeclip.fullvideo = document.getElementById('fullvideo');
          makeclip.error = false;

          makeclip.getTime = function() {
            return makeclip.fullvideo.currentTime;
          };

          makeclip.updateMarkerPos = function(num,pos) {
            console.log();
            var pct = ((100*makeclip.fullvideo.currentTime/videoInfo.clips[0].duration) - makeclip.mrkrCtrCorrect) + '%';
            makeclip.markers[num].style = {'left' : pct};
          };

          makeclip.updateVideoPos = function(time) {
            makeclip.fullvideo.pause();
            makeclip.fullvideo.currentTime = time;
          };

          makeclip.saveClip = function(clip) {
            if (clip.stop <= clip.start) {
              // error - stop must be greater then start
              makeclip.error = true;
            } else  {
              makeclip.error = false;
              if (clip.num == videoInfo.clips.length) {
                // if view/state is 'make clip' add temp clip to end of stored clips
                videoInfo.clips.push(clip);
              } else {
                // if view/state is 'edit clip' replace current clip with temp clip
                videoInfo.clips[clip.num]= clip;
              };
              makeclip.resetMarkers();
              makeclip.cleanup();
            };
          };

          makeclip.cleanup = function() {
            for (var i = 0; i < videoInfo.clips.length; i++) {
              if (videoInfo.clips[i] == null) {
                videoInfo.clips.splice(i, 1);
              };
            };
          };

          makeclip.getStyle = function() {
            var pct = ((100*makeclip.fullvideo.currentTime/videoInfo.clips[0].duration) - makeclip.mrkrCtrCorrect) + '%';
            return {'left' : pct};
          };

          makeclip.resetMarkers = function() {
            makeclip.markers[0].style = makeclip.markers[1].style = {'left' : '-6%'};
          };

        }],
        controllerAs: "makeclip"
      };
    });

    app.directive("videoClipinfo", function() {
      return {
        restrict: 'E',
        templateUrl: "video-clipinfo.html"
      };
    });

     app.directive("videoThumbs", function() {
      return {
        restrict: 'E',
        templateUrl: "video-thumbs.html",
        controller: ['videoInfo', function(videoInfo) {
          var thumbs = this;
          thumbs.clips = videoInfo.clips;
          thumbs.buttoncopy = videoInfo.videoThumbs.buttoncopy;
          thumbs.showData = false;
        }],
        controllerAs: "thumbs"
      };
    });

})();