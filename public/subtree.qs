
def Page main

  input: 0
    type: button
    .click: ()->
        this.set('value', this.get('value')+(this.l = ((this.l | 0)+1)%10));

  ListBox list:
     top: 20
     itemTemplate:
         Checkbox: {{done}}
             disabled: true
         div:
             value: {{name}}

     itemSource: [{name:'Не тупить целый день на лепре',done: true, description:'Выпрями спину и убери руку от лица'},
                  {name:'Купить хлеба',done: true, description:'При пожаре воруй, убивай, вступай в отношения с гусями'},
                  {name:'Позвонить Геннадию',done: false, description:'какое-то описание'}]