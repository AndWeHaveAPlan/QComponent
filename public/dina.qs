def Page main
    div
      height: {{s2.value*50}}px
      width: {{s2.value*50}}px
      div sinSquare
        background: #aaccaa
        height: 50px
        width: 50px
        //position: relative
        //top: {{sinSquareTop}}px
        //left: {{sinSquareLeft}}px
        //translation: [{{sinSquareTop}}, {{sinSquareLeft}}]
        //scale: [{{s2.value, s2.value}}]
        scale: [{{s2.value, s2.value}}]
        transform-origin: top left
        padding: 5px
        //transition: all 0.2s
        //skew: {{arr1}}
        //{{[sinVert, sinHor]}}
        div: ffff
            height: 40px
            width: 15px
            background: red
    public Number sinSquareTop: 0
    public Number sinSquareLeft: 0
    public Number sinVert: 0
    public Number sinHor: 0
    public String txt: ололо \n алала
    div
        //position: relative
        //top: {{s2.value*parseInt(sinSquare.height)}}px
        input setTop
            type: number
            width: 50px
            background: #aaaacc
        input setLeft
            type: number
            width: 50px
            background: #bbbbdd
        input: двигай
            type: button
            width: 100px
            .click: function(){
                self.sinSquareTop = setTop.value || 0
                self.sinSquareLeft = setLeft.value || 0
            }
        input: {{txt}}
            type: button
            width: 200px
            .click: function(){
                self.sinVert = setTop.value || 0
                self.sinHor = setLeft.value || 0
            }

        MaskedInput
            width: 100px
            background: #bbbbdd
            mask: '(ddd) ddd-dddd'

        div
            width: 500px
            Slider s2: 3
                from: 0
                to: 7
                step: 1
                background: BLUE
                fillColor: rgb({{s2.value*20}}, 0, 0)
        a: popopo
            href: http://ya.ru/
            //decoration: none
        TextBox: TextBox
            width: 25%
            background: #bbbbdd

        div
            background: #6688aa
            //padding: 10px 50px

            //height: 400px
            border: 2px solid blue
            color: white
            //scroll: vertical
            //overflow: hidden
            WrapPanel
                width: 200px
                div
                    background: 'rgba(85, 85, 34, 0.5)'
                    //#555522
                    width: 200px
                    //rgba(85, 85, 34, 0.5)
                    height: 100px
                    margin: 50px 20px 20px

                NumberKeyboard
                    margin: 0px 20px 20px
                    .key: function(button){
                        console.log(button)
                    }
            span: triangles
                color: yellow
                background: red
                border: 1px solid white
                padding: 3px
                margin: 20px
            span: are my favourite shapes
            input
                type: radio
                checked: true
            input addOne
                type: text
                width: 100px
            input: add this
                type: button
                .click: ()->
                    var x = list1.itemSource;
                    x.push({name: addOne});
                    list1.itemSource = x.slice();

            br
            HBox
                ListBox list1
                    width: 50%
                    height: 200px
                    background: white
                    color: black
                    border: 1px solid black
                    itemTemplate:
                        div: name: {{name}}
                            padding: 5px
                    itemSource: [
                        {name:'Кремль'},
                        {name:'Поклонная гора'},
                        {name:'Офис Квокки'},
                        {name:'Железнодорожное кольцо'}
                    ]
                WrapPanel
                    width: 300px
                    background: blue
                    span: WrapPanel
                    br
                    input setTop
                        type: number
                        width: 50px
                        background: #aaaacc
                    input setLeft
                        type: number
                        width: 50px
                        background: #bbbbdd
                    input: двигай
                        type: button
                        width: 100px
                        .click: function(){
                            self.sinSquareTop = setTop.value || 0
                            self.sinSquareLeft = setLeft.value || 0
                        }
                    input: {{txt}}
                        type: button
                        width: 200px
                        .click: function(){
                            self.sinVert = setTop.value || 0
                            self.sinHor = setLeft.value || 0
                        }


        public Array arr1: [10,2]
        //public Date date1:
        span: {{arr1}}


//{{Math.ceil(s1.value/2)}}