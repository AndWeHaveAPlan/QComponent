def Page main
  Video video
    time: {{s1}}
    value: 'http://vjs.zencdn.net/v/oceans.mp4'
    controls: false
    width: 330px
    height: 330px

  Slider s1: {{video.time}}
    from: 0
    to: {{video.duration}}
    //step: 1
  Button b1: {{s1}}
    .click: function(){
      video.play();
    }