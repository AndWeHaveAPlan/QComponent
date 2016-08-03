def UIComponent main
 Timer t1
  interval: 5000
  enabled: true
  .tick: ()=>{
      console.log('tick');
      r1.generate();
  }


 Random r1:
  from: 0001
  to: 7631

 embed e1
  quality: high
  pluginspage: 'http://www.macromedia.com/go/getfashplayer'
  type: application/x-shockwave-flash
  width: 690
  height: 430
  src: {{'http://z0r.de/L/z0r-de_'+r1.randomNumber+'.swf'}}

 input: Next
  type: button
  .click: ()->
    t1.start();
    r1.generate();