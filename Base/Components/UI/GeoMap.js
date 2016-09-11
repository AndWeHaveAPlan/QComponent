/**
 * Created by ravenor on 13.07.16.
 */

var Property = require('../../Property');
var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('GeoMap', {
    createEl: function () {
        var self = this;

        this.el = UIComponent.document.createElement('div');
        this.el.id = this.id;

        var script = UIComponent.document.createElement("script");
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=en_US';
        UIComponent.document.head.appendChild(script);

        script.onload = function () {
            ymaps.ready(function () {
                self.mapApi = ymaps;
                self.ymap = new ymaps.Map(self.id, {
                    center: [55.76, 37.64],
                    zoom: self.get('zoom'),
                    controls: ['zoomControl', 'searchControl']
                });
                self.pinns = new ymaps.GeoObjectCollection(null, {
                    preset: 'islands#blueCircleDotIconWithCaption'
                });
                self.home = new ymaps.GeoObjectCollection(null, {
                    preset: 'islands#redCircleDotIconWithCaption'
                });

                var home = self._data.home;
                if (home)
                    self.home.add(
                        new ymaps.Placemark(home, {
                            iconCaption: 'You are here'
                        })
                    );

                var pins = self._data.pins;
                if (pins)
                    for (var i = 0; i < pins.length; i++) {
                        var p = pins[i];
                        p && self.pinns.add(new ymaps.Placemark(p.coords, {
                            iconCaption: p.name
                        }));
                    }

                self.ymap.geoObjects.add(self.pinns).add(self.home);

                self.set('ready', true);
            });
        };
    },

    makeRoute:function(from, to) {
        if (!this.mapApi) return;

        var self = this;

        self.ymap.geoObjects.remove(self.route);

        self.mapApi.route(
            [from, to],
            {routingMode: 'masstransit', multiRoute: true}
        ).done(function (route) {
                //self.mapApi.route({referencePoints:[from,to],params:{routingMode: 'masstransit'}}).then(function(route){
                self.route = route;
                self.ymap.geoObjects.add(self.route);

                function foo(){
                    var way, segments, moveList = [], tempRoute = route.getActiveRoute();

                    for (var i = 0; i < tempRoute.getPaths().getLength(); i++) {
                        way = tempRoute.getPaths().get(i);
                        segments = way.getSegments();
                        for (var j = 0; j < segments.getLength(); j++) {
                            var segment = segments.get(j);
                            moveList.push(segment.properties.get('text'));
                        }
                    }
                    self.set('moveList', moveList);
                }

                route.events.add('activeroutechange',foo);
                foo();
            });
    },

    _prop: {
        ready: new Property('Boolean', {description: 'True if YMap api ready'}, {
            get: Property.defaultGetter,
            set: function (key, value) {
            }
        }, false),
        zoom: new Property('Number', {description: 'Map zoom level (setZoom for ymap)'}, {
            get: Property.defaultGetter,
            set: function (key, value) {
                if (value > 18)
                    value = 18;
                if (value < 0)
                    value = 0;

                if (this.ymap)
                    this.ymap.setZoom(value, {duration: 1000});

                return value;
            }
        }, 11),
        pins: new Property('Array', {description: 'Mark on map'}, {
            get: Property.defaultGetter,
            set: function (key, value) {
                if (this.mapApi) {
                    this.pinns.removeAll();
                    for (var i = 0; i < value.length; i++) {
                        var p=value[i];
                        this.pinns.add(
                            new ymaps.Placemark(p.coords, {
                                iconCaption: p.name
                            })
                        );
                    }
                }
            }
        }),
        home: new Property('Array', {description: 'You are here point'}, {
            get: Property.defaultGetter,
            set: function (key, value) {
                if (this.mapApi)
                    ymaps.ready(function () {
                        this.home.removeAll();
                        this.home.add(
                            new ymaps.Placemark(value, {
                                iconCaption: 'You are here'
                            })
                        );
                    });
            }
        }),
        moveList: new Property('Array',{},{
            get: Property.defaultGetter,
            set: function(){}
        },[])
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        var children = this.el.childNodes;
        var count = children.length;
        for (var i = 0, length = children.length; i < length; i++) {
            children[i].style.height = 100 / count + '%';
            children[i].style.position = 'relative';
            children[i].style.width = '100%';
        }
    }
});