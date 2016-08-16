def UIComponent Flash
  embed e1
    quality: high
    pluginspage: http://www.macromedia.com/go/getfashplayer
    type: application/x-shockwave-flash
    width: 100%
    height: 100%
    src: {{value}}

def Page main
  height:100%
  Title: z0r.qs
  background: black
  color: white

  Timer t1
    interval: 7000
    enabled: true
    .tick: ()=>{
      console.log('tick');
      r1.generate();
    }

  Random r1:
    from: 1
    to: 7631

  VBox
      height: 100%
      flexDefinition: 38 * 38

      center
        h1: URL: http://z0r.de/L/z0r-de_{{r1.randomNumber}}.swf

      Flash: http://z0r.de/L/z0r-de_{{r1.randomNumber}}.swf
        width: 100%
        height: 100%

      div
        input: Next
          type: button
          .click: ()->
            t1.start();
            r1.generate();


