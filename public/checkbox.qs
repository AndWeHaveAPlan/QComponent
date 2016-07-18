def UIComponent Checkbox1
   public Boolean checked: {{value}}
   input i1:
     type: checkbox
     checked: {{checked?'checked':void 0}}

def UIComponent TextBox
   public String text: {{value}}
   input i1:
     style: position: relative; background: red;
     type: text
     value: {{text}}

def UIComponent HBox
   public String text: {{value}}
   h1 d1:
     value: HBox
   ContentContainer


def UIComponent main
   TextBox hb1
       text: {{value}}
   HBox hb1
       text: {{value}}
  /* Checkbox1 c1:
       checked: {{value}}*/