def UIComponent Flash
  public Number width

  embed e1
    quality: high
    pluginspage: http://www.macromedia.com/go/getfashplayer
    type: application/x-shockwave-flash
    width: 100%
    public hu: ita
    public height: 100%
    src: {{value}}

def UIComponent main

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
  marquee
    h1: URL: {{f1.value}}

  Flash f1: http://z0r.de/L/z0r-de_{{r1.randomNumber}}.swf
    width: 100%
    height: 90%
    hu: 22

  div
    input: Next
      type: button
      .click: ()->
        t1.start();
        r1.generate();