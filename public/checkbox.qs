def UIComponent HBox
   public Boolean checked: {{value}}
   input i1
     type: input
     checked: {{checked?'checked':void 0}}

def UIComponent Checkbox
   public Boolean checked: {{value}}
   input i1
     type: checkbox
     checked: {{checked?'checked':void 0}}



def UIComponent main
   HBox c2: true
   Checkbox c1: {{value}}
   HBox c3: true