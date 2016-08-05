def Page main
    title: Карта
    width:100%
    height:100%

    HBox
        height: 100%
        width: 100%
        GeoMap gm:
            height: 100%
            width: 100%

        div
            ListBox list:
                itemSource: [{value:2}]