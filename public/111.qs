def Page main

    Timer timer:
        enabled: true
        interval: 1000
        .tick: function () {

            counter += coeff

            var list = list1.itemSource;
            for (var i = 0; i < coeff; i++) {

                list.push({color: 'red', size: 5})
                break;
            }
            list1.itemSource = list.slice();
            counterRed += coeff

            time += 1
        }

    public Number improveCounter: 1
    public Number counter: 0
    public Number counterRed: 0
    public Number counterYellow: 0
    public Number time: 0

    input improve: improve {{improveCounter}}
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
            timer.enabled = true;
        }
    span: {{"оранжевых: 0, желтых: "+counterYellow+", красных: "+counterRed+ " время: "+time}}
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
            var list = list1.itemSource;
            list.push({color: 'red', size: 20})
            list1.itemSource = list.slice();

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
            for (var i = 0; i < 2; i++)
                list.pop();
            list.unshift({color: 'yellow', size: 40})
            list1.itemSource = list.slice();

        }

    input: make purple
        type: button
        padding: 5px
        .click: () ->
          var list = list1.itemSource;
          list.unshift({color: 'purple', size: 40*4})
          list1.itemSource = list.slice();

    WrapPanel list1
        //itemWidth: 25%
        width: 205px
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

//{color:'#ce0', size: 40}, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1