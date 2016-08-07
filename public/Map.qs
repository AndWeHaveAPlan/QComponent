def ItemTemplate geoObject
    div name:{{name}}
       padding: 12px

def Page main
    title: Карта
    width:100%
    height:100%

    HBox
        height: 100%
        width: 100%
        GeoMap gm:
            zoom: 11
            pin: {{list.selectedItem}}
            height: 100%
            width: 100%

        div
            ListBox list:
                itemTemplate: geoObject
                itemSource: [
                    {name:'Кремль', coords:[55.751617, 37.617887]},
                    {name:'Поклонная гора', coords:[55.734076, 37.516858]},
                    {name:'Офис Квокки',coords:[55.773381, 37.621968]}
                ]