def Page main

    Timer timer:
        enabled: true
        interval: 1000
        .tick: function () {

            counter += coeff

            for (var i = 0; i < coeff; i++) {

                list1.itemSource.push({color: 'red', size: 5})
                break;
            }
            counterRed += coeff

            time += 1
        }

    public Number improveCounter: 1
    public Number counter: 0
    public Number counterRed: 0
    public Number counterYellow: 0
    public Number counterOrange: 0
    public Number time: 0


    HBox
        div
            input improve: red +{{improveCounter}}/sec
                type: button
                padding: 5px
                enabled: {{improveCounter == 1 && counterYellow >= 5}}
                .click: function () {
                    if (improveCounter == 1){
                        coeff += 1;
                        console.log("коэффициент: ", coeff)
                    }
                    improveCounter+=1;

                    console.log("импрув каунтер: ", improveCounter)
                    improve.enabled = false
                }
            span: {{"оранжевых: "+counterOrange+", желтых: "+counterYellow+", красных: "+counterRed+ " время: "+time}}
                margin: 10px
            br
            br
            public Number coeff: 0
            input make20: make red square
                type: button
                padding: 5px
                .click: function(){
                    counter += 1
                    counterRed += 1
                    list1.itemSource.push({color: 'red', size: 20})

                }

            span outp1: {{counter}}{{' (+ '+coeff+')'}}
                margin: 10px

            input make40: red to yellow
                type: button
                padding: 5px
                enabled: {{counterRed >= 2}}

                // false// {{list1.itemSource.filter((item)->return item.color=='red').length>9}}
                .click: function () {
                    counterRed -= 2
                    counterYellow += 1
                    var list = list1.itemSource;
                    var kill = 2

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].color == "red" && kill > 0) {
                            list.splice(i,1);
                            i--;
                            kill--;
                        }
                    }
                    for (var i = 0; i < list.length; i++) {
                        if(list[i].color == "red")
                          break;
                    }

                    list.splice(i,0,{color: 'yellow', size: 40});
                    if (counterYellow >= 10) {
                        make80.visibility = 'visible'
                    }

                    list1.itemSource = list.slice();
                }

            input make80: yellow to orange
                type: button
                padding: 5px
                enabled: {{counterYellow >= 5}}
                visibility: collapsed

                // false// {{list1.itemSource.filter((item)->return item.color=='red').length>9}}
                .click: function () {
                    counterYellow -= 5
                    counterOrange += 1
                    var kill = 5

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].color == "yellow" && kill > 0) {
                            list1.itemSource.splice(i,1);
                            i--;
                            kill--;
                        }
                    }
                    list1.itemSource.unshift({color: 'orange', size: 80});


                }

            /*input: make purple
                type: button
                padding: 5px
                .click: () ->
                  var list = list1.itemSource;
                  list.unshift({color: 'purple', size: 40*4})
                  list1.itemSource = list.slice();*/


        div
            WrapPanel list1
                //itemWidth: 25%
                width: 245px
                height: 60%
                background: white
                color: black
                border: 1px solid black
                itemTemplate:
                    div
                        width: {{(size||20)+'px'}}
                        height:{{(size||20)+'px'}}
                        background: {{color||'#f00'}}
                        border: 1px #fff solid
                itemSource: [

                    ]

        public Number castleHeight: 500
        public Number castleWidth: 500

        div castle
            background: #eeeeee
            height: {{castleHeight}}px
            width: {{castleWidth}}px
            canvas
                /*triangle: [[0,{{time}}],[100,0],[50,100]]
                    background: #f0f
                triangle: [[40,0],[1000,0],[50,100]]
                    background: #ff0*/
                rectangle: [10, {{castleHeight-100}}, 50, 100]
                    //left top w h
                    background: 'orange'
                rectangle: [110, {{castleHeight-200}}, 20, 200]
                    background: 'yellow'
                rectangle rec3
                    left: {{castleWidth/2-rec3.width/2}}
                    top: {{castleHeight-150}}
                    width: 150
                    height: 150
                    background: 'red'
                rectangle: [360, {{castleHeight-200}}, 20, 200]
                    background: 'yellow'
                rectangle: [410, {{castleHeight-100}}, 50, 100]
                    //left top w h
                    background: 'orange'
//{color:'#ce0', size: 40}, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1