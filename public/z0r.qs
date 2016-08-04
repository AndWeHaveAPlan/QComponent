def UIComponent Flash
  public Number width

  embed e1
    quality: high
    pluginspage: http://www.macromedia.com/go/getfashplayer
    type: application/x-shockwave-flash
    width: {{width}}
    public height: {{height}}
    src: {{value}}

def UIComponent main
  Title: z0r.qs

  Timer t1
    interval: 15000
    enabled: true
    .tick: ()=>{
      console.log('tick');
      r1.generate();
    }

  Random r1:
    from: 0001
    to: 7631

  h1: URL: http://z0r.de/L/z0r-de_{{r1.randomNumber}}.swf

  Flash: http://z0r.de/L/z0r-de_{{r1.randomNumber}}.swf
    width: 690
    height: 430

  div
    input: Next
      type: button
      .click: ()->
        t1.start();
        r1.generate();


