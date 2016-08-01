def UIComponent Button
    public Boolean click: {{i1.click}}
    public Boolean disabled
    input i1: {{$value}}
       disabled: {{$disabled}}
       type: button
       width: 80
       height: 30

def UIComponent main
 style
     background: #fff

 div
   Button b2: {{$value}}
     .click: function(e){
       console.log(e);
       console.log('you clicked on button2');
     }

   Button b1: bb
     .click, /*comment!*/ mouseup: (e/*haha*/m) ->console.log(7)
       console.log(16);
       var name = 'value'
       b2.a[name] = 99

       b2.set(['a',name].join('.'),99);