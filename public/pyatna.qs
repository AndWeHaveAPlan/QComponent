def Page main
    div
        height: 280px
        width: 280px
        WrapPanel list1
            itemWidth: 25%
            width: 100%
            height: 100%
            background: white
            color: black
            border: 1px solid black
            itemTemplate:
                input: {{value}}
                    type: button
                    border: 2px solid black
                    height: 70px
                    width: 70px
            itemSource: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ' '
            ]
            .itemClick: (val, index)->
                //смотрим результаты деления
                var col = index % 4;
                var row = index / 4 |0;
                var col0, row0;

                var list = this.itemSource;
                var nulIndex;

                for (var i = 0; i < list.length; i++) {
                    //console.log("null = ", col0, row0)
                    if (list[i] == " ") {
                        col0 = i % 4
                        row0 = i / 4 |0
                        nulIndex = i
                    }
                    //console.log("null = ", col0, row0)
                }
                console.log(col, row, col0, row0)
                var steps = Math.abs(col-col0)+Math.abs(row-row0)
                if (steps == 1) {
                    var temp = list[index]
                    list[index] = list[nulIndex]
                    list[nulIndex] = temp
                    list = list.slice();
                    this.set('itemSource', list);
                }