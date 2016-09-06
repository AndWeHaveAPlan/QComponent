def Page main

    Timer timer:
        enabled: true
        interval: 1000
        .tick: function () {
            counter += coeff
            counterRed += coeff+1
            time += 1;			
			list1.itemSource.splice((Math.random()*list1.itemSource.length)|0,0,{color: 'red', size: 20});
					
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
            if (improveCounter == 1) {
                coeff += 1
                console.log("коэффициент: ", coeff)
            }
            
            improveCounter+=1;

            console.log("импрув каунтер: ", improveCounter)
            improve.enabled = false
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
            counter += 1;
            counterRed += 1;			

			list1.itemSource.push({color: 'red', size: 20});
        }

    span outp1: {{counter}}{{' (+ '+coeff+')'}}
        margin: 10px

    input make40: red to yellow {{ counterRed }}
        type: button
        padding: 5px		
        enabled: {{counterRed >= 10}}
        // false// {{list1.itemSource.filter((item)->return item.color=='red').length>9}}
        .click: function () {
            counterRed -= 10
            counterYellow += 1            
            
			for(var i=0;i<10;i++)
			    list1.itemSource.pop();
            list1.itemSource.unshift({color: 'yellow', size: 40});
        }



    WrapPanel list1
        //itemWidth: 25%
		scroll: vertical
        width: 100%
        height: 60%
        background: white
        color: black
        border: 1px solid black
        itemTemplate:
            div
                width: {{(size)+'px'}}
                height:{{(size||20)+'px'}}
                background: {{color||'red'}}
                border: 1px #fff solid
        itemSource: [

            ]

//{color:'#ce0', size: 40}, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1