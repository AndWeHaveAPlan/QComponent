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
        width: 200
        visibility: 'block'
        visibility: {{top.currentScreen || top.currentScreen=='s1'?'none':'block'}}
        h2: Введите номер
        div:
            margin: 0 auto
            overflow: hidden
            span: +7
                margin: 3px 0 0 0
                float: left
            TextBox number:
                border: 2px solid #ffa834
        NumberKeyboard k1
        Button b1: Далее
            float: right
            disabled: true
            disabled: {{number.text.length!=10}}
    div s2:
        width: 200
        visibility: 'none'
        visibility: {{top.currentScreen=='s2'?'block':'none'}}
        h2: {{'+7'+number.text}}
        h2: Введите сумму
        div:
            margin: 0 auto
            overflow: hidden
            TextBox sum:
                width: 134
                float: left
                border: 2px solid #ffa834
            span: рублей
                margin: 3px 0 0 6px
        NumberKeyboard k2
        Button b2: Далее
            float: right