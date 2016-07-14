def UIComponent Checkbox
   public Boolean checked: {{value}}
   input i1
     type: checkbox
     checked: {{checked?'checked':void 0}},
     value: 1{{checked}}