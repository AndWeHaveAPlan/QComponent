def UIComponent Button
    public Boolean click: {{i1.click}}
    public Boolean disabled
    input i1: {{value}}
       disabled: {{disabled}}
       type: submit
       width: 80
       height: 30

def UIComponent main
   Button b1: bb
     .click, /*comment!*/ mouseup: (e/*haha*/m) ->console.log(7)
       console.log(16);
