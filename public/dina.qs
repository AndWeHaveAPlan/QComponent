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
        scale: {{[s2.value, s2.value]}}
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
            //margin: {{s2.value*50}}px
            type: button
            width: 200px
            .click: function(){
                self.sinVert = setTop.value || 0
                self.sinHor = setLeft.value || 0
            }

        MaskedInput: 12345
            width: 100px
            background: #6666dd
            mask: "(***) ddd-dddd"

        div: ba-dum-tsss {{setLeft.background}}
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
            HBox
                height: 400px
                VBox
                    width: 250px
                    background: #6688cc
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
                        scale: [0.5, 0.5]
                VBox
                    width: 250px
                    background: #6655cc
                    Image
                        width: 250px
                        height: 250px
                        source: https://pp.vk.me/c604418/v604418537/242da/51K4Qj6ezOI.jpg
                        stretch: uniform
                        .click: function () {
                            phot.Image.source = this.source
                        }
                GeoMap
                    zoom: 11
                    width: 100%
                    height: 50%
                    home: [55.794425,37.587836]

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
                    width: 70%
                    height: 200px
                    background: white
                    padding: 20px
                    color: black
                    border: 1px solid black
                    itemTemplate:
                        a: name: {{name}}
                            padding: 5px
                            href: https://yandex.ru/search/?msid=1472225549.95604.22881.8172&text={{name}}
                    itemSource: [
                        {name:'Кремль'},
                        {name:'Поклонная гора'},
                        {name:'Офис Квокки'},
                        {name:'Железнодорожное кольцо'}
                    ]
                ListBox
                    itemTemplate:
                        span: name: {{name}}
                            padding: 5px
                    itemSource: [
                        {name:'Кремль'},
                        {name:'Поклонная гора'},
                        {name:'Офис Квокки'},
                        {name:'Железнодорожное кольцо'},
                        {name:'Кремль'},
                        {name:'Поклонная гора'},
                        {name:'Офис Квокки'},
                        {name:'Железнодорожное кольцо'}
                    ]
                    //background: pink
                    //padding: 10px
                    height: 150px
                    //width: 150px
                    border: 5px solid red
                    //position: relative
                    border-radius: 10px
                    //top: 50px
                    //bottom
                    //left
                    //right
                    //transform: [
                    //    {type:'rotation', angle: 30},
                    //    {type:'scale', x:0.5,y:0.5},
                    //    {type:'translation', x:50,y:50}
                    //]
                    //rotation
                    //transition
                    //scale
                    //skew
                    margin: 20px
                    color: orange
                    //float: right
                    //-overflow
                    //transform-origin
                    //-scroll
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
            background: pink
        MaskedInput: 7777рпааапрпарап
            mask: 'ddd-dd-dd'
            background: pink
            padding: 10px
            //height: 200px
            width: 150px
            //border: 5px solid red
            //position: relative
            //border-radius: 10px
            //top: 50px
            //bottom
            //left
            //right
            //transform: [
            //    {type:'rotation', angle: 30},
            //    {type:'scale', x:0.5,y:0.5},
            //    {type:'translation', x:50,y:50}
            //]
            //rotation
            //transition
            //scale
            //skew
            //margin: 20px
            //-color: orange
            //float: right
            //-overflow
            //transform-origin
            //-scroll

    div phot
        position: absolute
        top: 20px
        left: 20px
        Image
            width: 700px
            height: 500px
            stretch: uniform

//{{Math.ceil(s1.value/2)}}