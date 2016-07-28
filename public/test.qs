def UIComponent Checkbox
   public Boolean checked: {{value}}
   div:
       input i1:
           type: checkbox
           checked: {{checked?'checked':void 0}}

def UIComponent main
   Checkbox c1:
   Checkbox c2:
   Checkbox c3: {{!c1.value}}
   Checkbox c4: {{c1.value && c2.value}}
   Checkbox c5: {{c1.value || c2.value}}
   Checkbox c6: {{c1.value ^ c2.value}}