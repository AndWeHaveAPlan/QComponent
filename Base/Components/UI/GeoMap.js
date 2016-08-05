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

        var script = document.createElement("script");
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        document.head.appendChild(script);

        script.onload = function () {
            ymaps.ready(function () {
                self.ymap = new ymaps.Map(self.id, {
                    center: [55.76, 37.64],
                    zoom: 10
                });
            });
        };
    },
    _prop: {
        zoom: new Property('Number', {description: 'Map zoom level (setZoom for ymap)'}, {
            get: Property.defaultGetter,
            set: function (key, value) {
                if (value > 18)
                    value = 18;
                if (value < 0)
                    value = 0;
                this.ymap.setZoom(value, {duration: 1000});

                return value;
            }
        })
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