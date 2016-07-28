def UIComponent TextBox
    public String text: {{ i1.value }}
    input i1: {{top.value}}
       type: text
       width: 100%

def UIComponent Button
    public Boolean click: {{i1.click}}
    public Boolean disabled
    input i1: {{top.value}}
       disabled: {{top.disabled}}
       type: submit
       width: 80
       height: 30

def UIComponent main
    public Boolean currentScreen: {{ b1.click?'s2':void 0 }}
    div s1:
        visibility: 'block'
        visibility: {{top.currentScreen || top.currentScreen=='s1'?'none':'initial'}}
        h2: Введите номер
        div:
            overflow: hidden
            span: +7
                float: left
            TextBox number:
        NumberKeyboard k1
        Button b1: Далее
            disabled: true
            disabled: {{number.text.length!=10}}
    div s2:
        visibility: 'none'
        visibility: {{top.currentScreen=='s2'?'initial':'none'}}
        h2: {{'+7'+number.text}}
        h2: Введите сумму
        div:
            overflow: hidden
            TextBox sum:
                float: left
            span: рублей
        NumberKeyboard k2
        Button b2: Далее
