def UIComponent TextBox
    public String text: {{ i1.value }}
    input i1: {{top.value}}
       type: text
       width: 100%

def UIComponent Button
    public Boolean click: {{i1.click}}
    input i1: {{top.value}}
       type: submit
       width: 80
       height: 30


// DetailsPanel
def UIComponent DetailsPanel
    public Boolean click: {{b1.click}}
    public String item: {{ ({done:checkBoxDone.checked, name:textBoxTaskName.value, description: textDescription.value}) }}
    Checkbox checkBoxDone: {{top.value.done}}
    input textBoxTaskName: {{top.value.name}}
           type: text
           width: 100%
    textarea textDescription: {{top.value.description}}
        width: 100%
        height: 70
    Button b1: Сохранить


def ItemTemplate listBoxItemTemplate
    Checkbox: {{top.done}}
        disabled: true
    div:
        value: {{top.name}}

def UIComponent main
   top: 12px;
   public String valueProxy: {{top.value}}
   public String sItem: {{list.selectedItem}}
   String href: "http://google.com"
   HBox hbox:
       ListBox list:
           top: 20
           selectedItem: {{ dp.click?dp.item:void 0 }}
           itemTemplate: listBoxItemTemplate
           itemSource: [{name:'Не тупить целый день на лепре',done: true, description:'Выпрями спину и убери руку от лица'},
                        {name:'Купить хлеба',done: true, description:'При пожаре воруй, убивай, вступай в отношения с гусями'},
                        {name:'Позвонить Геннадию',done: false, description:'какое-то описание'}]
    DetailsPanel dp: {{list.selectedItem}}