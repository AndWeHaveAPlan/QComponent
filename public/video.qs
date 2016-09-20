def Page main
  Video video
    time: {{s1}}
    value: 'http://vjs.zencdn.net/v/oceans.mp4'
    controls: false


  Slider s1: {{video.time}}
    from: 0
    to: {{video.duration}}
    //step: 1
  Button b1: {{s1|0}}
    .click: function(){
      video.play();
    }

  Label: Time to the end {{(video.duration-video.time)|0}}