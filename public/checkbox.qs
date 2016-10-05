def UIComponent Checkbox2
   public Boolean checked: {{i1.value?'true':'false'}}
   div:
       input i1: {{checked}}
           type: checkbox

def UIComponent TextBox2
   public String text: {{value}}
   input i1:
     type: text
     value: {{text}}


def Page main

   TextBox2:
       text: {{c1.checked}}
   Checkbox2 c1
   div d1:
       Checkbox2 c2:
           checked: {{c1.checked}}