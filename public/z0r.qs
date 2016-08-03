/*
  Awesome z0r.de TV
*/

def UIComponent main
 background: #000

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
  background: #000
  height: 100%
  width: 100%
  quality: high
  pluginspage: 'http://www.macromedia.com/go/getfashplayer'
  type: application/x-shockwave-flash

  src: {{'http://z0r.de/L/z0r-de_'+r1.randomNumber+'.swf'}}


 input: Next
     display: block
     type: button
     .click: ()->
         t1.start();
         r1.generate();
 input: {{t1.interval/1000}}
      display: block
      type: text

 input: moar
     display: block
     type: button
     .click: ()->
         t1.set('interval', t1.get('interval')+1000)
