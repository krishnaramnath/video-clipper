
(function(){
    var app = angular.module('video-directives', []);

    app.directive("videoHolder", function() {
      return {
        restrict: 'E',
        templateUrl: "video-holder.html",
        controller: ['$scope','$sce','videoInfo', function($scope,$sce,videoInfo) {
          player = this;
          player.srcfile = $sce.trustAsResourceUrl(videoInfo.srcfile);
          player.firstTime = true;
          player.fullvideo = document.getElementById('fullvideo');
          player.loading = true;

          $scope.$on('setActive', function(e,num) {player.setActive(num)});

          player.fullvideo.addEventListener('loadedmetadata', function (e) {
            player.loading = false;
            $scope.$apply();
            if (player.firstTime == true) {    
              player.firstTime = false;
              // store full video duration
              videoInfo.clips[0].stop = videoInfo.clips[0].duration = player.fullvideo.duration;
              $scope.$emit('initialload');
            } else {
              // if not initial load, play video upon loaded
              player.fullvideo.play();
            }
          }.bind(player), false);

          player.fullvideo.addEventListener('timeupdate', function (e) {
            if (videoInfo.activeThumb > 0) {
              if (player.fullvideo.currentTime >= videoInfo.clips[videoInfo.activeThumb].stop) {
                if ((videoInfo.playall == true) && (videoInfo.state == 'player' )) {
                  var num = 0;
                  if (videoInfo.activeThumb < videoInfo.clips.length - 1) {
                    num = videoInfo.activeThumb + 1;
                  } 
                 var self = this;
                 setTimeout(function() {self.setActive(num)}, 3000);
                 $scope.$apply();
                }
              }
            }
          }.bind(player), false);

          player.fullvideo.addEventListener('ended', function (e) {
            if ((videoInfo.playall == true) && (videoInfo.state == 'player' )) {
              var num = 0;
              if (videoInfo.activeThumb < videoInfo.clips.length - 1) {
                num = videoInfo.activeThumb + 1;
              } 
              var self = this;
              setTimeout(function() {self.setActive(num)}, 3000);
              $scope.$apply();
            }
          }.bind(player), false);

          player.setActive = function(num) {
            videoInfo.activeThumb = num;
            player.fullvideo.removeAttribute("src");
            player.fullvideo.load();
            player.loading = true;
            player.srcfile = $sce.trustAsResourceUrl(videoInfo.srcfile.concat('#t=' +  videoInfo.clips[num].start+','+videoInfo.clips[num].stop));
            player.fullvideo.getElementsByTagName('source')[0].setAttribute('src', player.srcfile);
            player.fullvideo.load();
          };
        }],
        controllerAs: "player"
      };
    });

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
        controller: ['$scope','videoInfo', function($scope,videoInfo) {
          var thumbs = this;
          thumbs.clips = videoInfo.clips;
          thumbs.buttoncopy = videoInfo.videoThumbs.buttoncopy;
          thumbs.showData = false;
          thumbs.playall = videoInfo.playall;

          thumbs.updatePlayall = function(){
            videoInfo.playall = thumbs.playall;
          }
        }],
        controllerAs: "thumbs"
      };
    });

})();