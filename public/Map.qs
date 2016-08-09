def ItemTemplate geoObject
    div name:{{name}}
       padding: 12px

def Page main
    title: Карта туриста
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
                    {name:'Офис Квокки',coords:[55.773381, 37.621968]},
                    {name:'Железнодорожное кольцо',coords:[55.520779, 37.546269]},
                    {name:'Парк отдыха "Сокольники"',coords:[55.795549, 37.673884]},
                    {name:'Воробьевы горы',coords:[55.709588, 37.564691]},
                    {name:'Парк Горького',coords:[55.729435, 37.601150]},
                    {name:'Сад Эрмитаж',coords:[55.770494, 37.608519]},
                    {name:'Парк Победы',coords:[55.731841, 37.506587]},
                    {name:'Тимирязевский парк',coords:[55.819574, 37.544653]}
                ]