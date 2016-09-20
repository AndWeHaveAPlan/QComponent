def Page main
  Video video
    time: {{s1}}
    value: 'http://vjs.zencdn.net/v/oceans.mp4'
    controls: true

  Slider s1: {{video.time}}
    from: 0
    to: {{video.duration}}
