def UIComponent main
 /*Timer t1
  interval: 10000
  start: true

 Random: r1
  type: number
  from: 0001
  to: 7631
  generate: {{t1.tick}}*/

 input r1: 7631
   type: number

 embed e1
  quality: high
  pluginspage: 'http://www.macromedia.com/go/getfashplayer'
  type: application/x-shockwave-flash
  width: 690
  height: 430
  src: {{'http://z0r.de/L/z0r-de_'+r1.value+'.swf'}}

 /*button: Next
  .click: ()->
    t1.tick()*/