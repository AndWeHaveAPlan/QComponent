def UIComponent Button
    input i: {{value}}a
       public disabled: {{disabled}}
       background: {{background}}
       type: button
       width: 80
       height: 30

def UIComponent main
 div
   Button b2: text
     .click: function(e){
       console.log(e);
       console.log('you clicked on button2');
       this.set('value', this.get('value')+1);
       debugger;
     }

   Button b1: bb
     .click, /*comment!*/ mouseup: (e/*haha*/m) ->console.log(7)
       b2.set('background','#f00');
       console.log(16);