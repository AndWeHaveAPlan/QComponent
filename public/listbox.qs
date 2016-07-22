def UIComponent Checkbox1
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


def UIComponent main
   public String valueProxy: {{value}}
   String href: "http://google.com"
   HBox hbox:
       ListBox list:
           a: {{valueProxy}}
               href: {{value}}
           a: {{valueProxy}}
               href: {{href}}
           a: {{valueProxy}}
               href: {{href}}
           a: {{valueProxy}}
               href: {{href}}
       div:
           TextBox t1:
               text: {{valueProxy}}
           Checkbox1 cb1: {{valueProxy}}
           Checkbox1: {{value}}
           Checkbox1: {{value}}