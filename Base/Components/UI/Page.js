/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent'),
    QObject = require('../../QObject');
var Property = require('../../Property');


module.exports = UIComponent.extend('Page', {
    createEl: function () {
        var self = this;
        this.el = QObject.document.body;

        /*function handleEvent(event) {
            event.cancelBubble = true;
            event.stopPropagation();
            event.preventDefault();

            function rec(component) {
                var ret = null;
                var iterator = component._ownComponents.iterator(), item, ctor, type, cmp;

                while (item = iterator.next()) {
                    if (item && item.el) {
                        var br = item.el.getBoundingClientRect();
                        if (
                            event.clientX <= br.right &&
                            event.clientX >= br.left &&
                            event.clientY <= br.bottom &&
                            event.clientY >= br.top
                        ) {
                            ret = rec(item);
                            item.fire(event.type);
                        }
                    }
                }

                iterator = component._children.iterator();
                while (item = iterator.next()) {
                    if (item && item.el && item.el.getBoundingClientRect) {
                        var br = item.el.getBoundingClientRect();
                        if (
                            event.clientX <= br.right &&
                            event.clientX >= br.left &&
                            event.clientY <= br.bottom &&
                            event.clientY >= br.top
                        ) {
                            ret = rec(item);
                            item.fire(event.type);
                        }
                    }
                }

                return ret ? ret : component;
            }

            var c = rec(this);
            console.log(c.id + ', ' + c._type);
            //console.log(event.type);
            //rec(this).fire(event.type);
        }

        var events = [];
        for (var key in this.el) {
            if (key.substr(0, 2) === 'on') {
                events.push(key.substr(2, key.length));
                this.el.addEventListener(key.substr(2, key.length), handleEvent.bind(this), true);
            }
        }*/


    },
    _prop: {
        title: new Property('String', {description: 'Page Title'}, {
            set: function (name, value) {
                document.title = value;
            },
            get: function (name, value) {
                return document.title;
            }
        }, '')
    }
});