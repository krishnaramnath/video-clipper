(function() {
  var app = angular.module('videoClipper', ['video-directives'])
  .factory('videoInfo', [function() {
    return {
      "srcfile" : "/media/sintel_trailer-480.mp4",
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

  app.controller('ClipperController', ['$scope','$sce','$window','videoInfo', function($scope,$sce,$window,videoInfo){
    var clipper = this;
    // set full video source and loading status
    clipper.srcfile = $sce.trustAsResourceUrl(videoInfo.srcfile);
    clipper.loading = true;
    clipper.activeThumb = 0;
    clipper.playall = false;
    clipper.isMakeclipOpen = false;
    clipper.clips = videoInfo.clips;
    clipper.state = "player";
    clipper.firstTime == true;
    clipper.fullvideo = document.getElementById('fullvideo');
    
    clipper.fullvideo.addEventListener('loadedmetadata', function (e) {
      var fullvideo = clipper.fullvideo;
      clipper.loading = false;
      $scope.$apply();
      // store full video duration
      if (clipper.firstTime == true) {      
        clipper.firstTime = false;
        videoInfo.clips[0].stop = videoInfo.clips[0].duration = clipper.fullvideo.duration;
      } else {
        clipper.fullvideo.play();
      }
      clipper.fullvideo.play();
    }.bind(clipper), false);

    clipper.fullvideo.addEventListener('timeupdate', function (e) {
      if (clipper.activeThumb > 0) {
        if (clipper.fullvideo.currentTime >= videoInfo.clips[clipper.activeThumb].stop) {
          if ((this.playall == true) && (this.state == 'player' )) {
            var num = 0;
            if (this.activeThumb < videoInfo.clips.length - 1) {
              num = this.activeThumb + 1;
            } 
            var self = this;
            setTimeout(function() {self.setActive(num)}, 3000);
            $scope.$apply();
          }
        }
      }
    }.bind(clipper), false);

    clipper.fullvideo.addEventListener('ended', function (e) {
      if ((this.playall == true) && (this.state == 'player' )) {
        var num = 0;
        if (this.activeThumb < videoInfo.clips.length - 1) {
          num = this.activeThumb + 1;
        } 
        var self = this;
        setTimeout(function() {self.setActive(num)}, 3000);
        $scope.$apply();
      }
    }.bind(clipper), false);

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
      return clipper.activeThumb === num;
    };

    clipper.isLoading = function() {
      return clipper.loading;
    }

    clipper.setActive = function(num) {
      clipper.activeThumb = num;
      clipper.fullvideo.removeAttribute("src");
      clipper.fullvideo.load();
      clipper.loading = true;
      clipper.srcfile = $sce.trustAsResourceUrl(videoInfo.srcfile.concat('#t=' +  videoInfo.clips[num].start+','+videoInfo.clips[num].stop));
      clipper.fullvideo.getElementsByTagName('source')[0].setAttribute('src', clipper.srcfile);
      clipper.fullvideo.load();
    };

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
      if ((clipper.activeThumb > 0) && (clipper.state == 'edit')) {
        videoInfo.clips.splice(clipper.activeThumb, 1);
        clipper.activeThumb = 0;
      }
      clipper.scrollToTop();
      clipper.state = "player";
    }

    clipper.errorCheck = function() {
      // if not an error reset temp clip, close view
      if (clipper.tempClip.start < clipper.tempClip.stop) {
        clipper.reset();
        clipper.isMakeclipOpen = false;
        clipper.scrollToTop();
        clipper.state = "player";
      } 
    };

    clipper.removeTag = function(num) {
      clipper.tempClip.tags.splice(num, 1);
    };

    clipper.scrollToTop = function() {
      $window.scrollTo(0, 0);
    }

    clipper.setState = function(state) {
      clipper.state = state;
      if (state == "edit") {
        //set temp clip to active clip
        clipper.tempClip = videoInfo.clips[clipper.activeThumb];
      }
    }
    
  }]);

})();
