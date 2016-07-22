
def UIComponent TextBox
   public String text: {{value}}
   input i1:
     //style: position: relative; background: red;
     type: text
     value: {{text}}


def UIComponent main
   String valueProxy: {{value}}
   TextBox hb1: {{value}}
   input i1:
       type: text
       value: {{value}}
   input i2:
       type: text
       value: {{value+value}}