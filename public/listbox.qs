
def UIComponent TextBox
   public String text: {{top.value}}
   input i1:
     type: text
     value: {{top.text}}

def ItemTemplate listBoxItemTemplate
   div:
       value: {{top.name}}
   a: google.com
       href: google.com

def UIComponent main
   public String valueProxy: {{top.value}}
   public String sItem: {{list.selectedItem}}
   String href: "http://google.com"
   HBox hbox:
       ListBox list:
           itemTemplate: listBoxItemTemplate
           itemSource: [{name:'item1'},{name:'item2'},{name:'item3'}]
       div:
           TextBox t1: selectedIndex
               text: {{list.selectedIndex}}
           Checkbox cb1: {{!cb2.checked || top.value}}
           Checkbox cb2: {{!cb1.checked}}
           Checkbox: {{top.value}}