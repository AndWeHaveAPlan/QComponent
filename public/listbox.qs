def UIComponent Checkbox1
   public Boolean checked: {{top.value}}
   div:
       input i1:
           type: checkbox
           checked: {{top.checked?'checked':void 0}}

def UIComponent TextBox
   public String text: {{top.value}}
   input i1:
     type: text
     value: {{top.text}}


def UIComponent main
   public String valueProxy: {{top.value}}
   public String sItem: {{list.selectedItem}}
   String href: "http://google.com"
   HBox hbox:
       ListBox list:
           ItemTemplate:
               a:
                   value: google.com
       div:
           TextBox t1:
               text: {{top.sItem}}
           Checkbox1 cb1: {{top.valueProxy}}
           Checkbox1 cb2: {{cb1.value}}
           Checkbox1: {{top.value}}