
def UIComponent main



  button: 123

  ListBox list:
     top: 20
     selectedItem: {{ dp.click?dp.item:void 0 }}
     itemTemplate:
         Checkbox: {{done}}
             disabled: true
         div:
             value: {{name}}

     itemSource: [{name:'Не тупить целый день на лепре',done: true, description:'Выпрями спину и убери руку от лица'},
                  {name:'Купить хлеба',done: true, description:'При пожаре воруй, убивай, вступай в отношения с гусями'},
                  {name:'Позвонить Геннадию',done: false, description:'какое-то описание'}]