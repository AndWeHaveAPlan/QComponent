def Page main
    title: Карта туриста
    width:100%
    height:100%

    HBox// hbox
        flexDefinition: 293* 1* 400
        height: 100%
        width: 100%

        GeoMapGoogle gm:
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
            height: 100%
            width: 100%
            overflow: auto
            ListBox list:
                itemTemplate:
                    div: {{name}}
                       padding: 12px
                itemSource: [
                    {
                      name: 'Такси',
                      icon: "https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png",
                      coords: [55.751617, 37.617887],
                      route: [55.709588, 37.564691],
                      moving: true
                    },
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
            input buttonRoute: Как добраться
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                enabled: {{ gm.ready }}
                .click: ()=>{
                    var from = gm.get('home');
                    var to = gm.get('pins.0.coords');

                    console.log('from/to: ', from, to);

                    if(to) { gm.makeRoute(from, to); }
                    else { console.error("Destination isn't selected"); }
                }
            input: Увеличить
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                enabled: {{ gm.ready }}
                .click: ()=>{
                    var newZoom = gm.get('zoom') + 1;
                    gm.set('zoom', newZoom);
                }
            input: Уменьшить
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                enabled: {{ gm.ready }}
                .click: ()=>{
                    var newZoom = gm.get('zoom') - 1;
                    gm.set('zoom', newZoom);
                }
            input: Показать меня
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                enabled: {{ gm.ready }}
                .click: ()=>{
                    var home = gm.get('home');
                    gm.set('center', home);
                }
            input: Вывести мое положение
                margin: 12px
                padding: 12px
                width: 376px
                type: button
                enabled: {{ gm.ready }}
                .click: ()=>{
                    var center = gm.get('center');
                    console.log('My position', center);
                }
            ListBox:
                overflow: auto
                itemSource: {{gm.moveList}}
                margin: 12px
