def UIComponent Checkbox
   public Boolean checked: {{value}}
   div:
       input i1:
           type: checkbox
           checked: {{checked?'checked':void 0}}

def UIComponent TextBox
   public String text: {{value}}
   input i1:
     type: text
     value: {{text}}


def Page main
   String value: 12345
   String href: "http://google.com"
   TextBox:
       text: {{value}}
   Checkbox c1:
       checked: {{value}}
   HBox hbox:
       a:
           value: {{value}}
           href: {{123}}
       a:
           value: {{value}}
           href: {{456}}
   div d1:
       Checkbox c2:
           checked: {{value}}