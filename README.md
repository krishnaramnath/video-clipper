# video-clipper

An application that allows a user to slice­up a video (sample video:

http://grochtdreis.de/fuer­jsfiddle/video/sintel_trailer­480.mp4) into clips.


I used AngularJS to facilitate development:


Standard Features

- An HTML5 video player that utilizes media fragments

- A list of clips to be played in the video player

- The first item in the list should be the full video

- An interface to add new clips to the list by specifying a name, start time, and end time

- The ability to delete clips from the list (excluding the full video item​)

- The ability to edit existing clips in the list

- The ability to play clips in the video player


Bonus Features 
- The ability to automatically jump to the next clip after it finishes, with a 3 second waiting period and appropriate loading animation.

- The ability to ‘save’ clips for persistent use.

- The ability to add arbitrary ‘tags’ to clips so that they can be filtered by the tag name.

- Markers on the video player timeline that denote where a clip starts.

- The ability to reuse the the player and playlist on another page without the editing capabilities.


# installation:

- See /video-clipper/design.pdf for wire-frame, software architecture notes, and design docs
- To run, install contents of /video-clipper/deploy/in root directory of web server and run index.html

 ***** note: video file in this example is .mp4; make sure server environment supports .mp4 video/mpeg MIME type and browser supports playback of .mp4 video files


