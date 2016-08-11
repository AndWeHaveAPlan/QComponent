def UIComponent TextBox
    public String text: {{ i1.value }}
    input i1: {{value}}
       type: text
       width: 100%

def UIComponent Button
    public Boolean click: {{i1.click}}
    public Boolean disabled
    input i1: {{value}}
       disabled: {{disabled}}
       type: submit
       width: 80
       height: 30

def UIComponent main
    public Boolean currentScreen: {{ b1.click?'s2':void 0 }}
    div s1:
        width: 200
        display: {{currentScreen || currentScreen=='s1'?'none':'block'}}
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
            .click: function(e){
                        s1.display="none";
            }
            float: right
            disabled: true
            disabled: {{number.text.length!=10}}
    div s2:
        width: 200
        display: {{currentScreen=='s2'?'block':'none'}}
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





/*

1b 1b 16 1f 0c 1b 16 1f 1f 0d 1b 0e 1f
 6  4  3  8  1  6  2  0  0  5  4  9  8

00011011 00011011 00010110 00011111 00001100 00011011 00010110 00011111 00011111 00001101 00011011 00001110 00011111
    0110     0100     1102     1000     0001     0110     0010     0000     0000     0101     0100     1001     1000
       6        4        3        8        1        6        2        0        0        5        4        9        8


*/