def Page main
    title: Карта
    width:100%
    height:100%

    HBox hbox
        flexDefinition: 293* 1* 400
        height: 100%
        width: 100%

        GeoMap gm:
            zoom: 11
            home: [55.794425,37.587836]
            pins: {{[list.selectedItem]}}
            height: 100%
            width: 100%

        div
            width:100%
            height:100%
            background: black

        div
            ListBox list:
                itemTemplate:
                    div name:{{name}}
                       padding: 12px
                itemSource: [
                    {name:'Кремль', coords:[55.751617, 37.617887]},
                    {name:'Поклонная гора', coords:[55.734076, 37.516858]},
                    {name:'Офис Квокки',coords:[55.773381, 37.621968]},
                    {name:'qweqwe34qwe',coords:[55.792589,37.787025]}
                ]
            input buttonRoute: Как добраться
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                disabled: {{ !(gm.ready) }}
                .click: ()=>{
                    gm.makeRoute(gm.get('home'),gm.get('pins.0.coords'));
                }
            ListBox:
                itemSource: {{gm.moveList}}
                margin: 12px