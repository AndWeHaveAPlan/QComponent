/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('ListBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    addChild: function (child) {
        var self=this;
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        //TODO тут нах не нужен for!! а если уж for то и детей надо чистить
        var children = this._children;
        for (var i = 0, length = children.length; i < length; i++) {
            var childNode = children.get(i).el;
            childNode.style.clear = 'both';
            childNode.style.position = 'relative';

            (function (index) {
                childNode.addEventListener('click', function () {
                    self.set('selectedIndex', index);
                });
            })(i);
        }
    },
    _getter: {
        selectedIndex: function (name, val) {
            return this._data['selectedIndex'];
        },
        value:function (name, val) {
            this._setter.itemSource(name,val);
        },
        itemSource:function (name, val) {
            return this._data['itemSource'];
        }
    },
    _setter: {
        selectedIndex: function (name, val) {
            var oldVal = this._data['selectedIndex'];
            this._data['selectedIndex'] = val;

            var children = this.el.childNodes;
            if (oldVal != void(0) && oldVal < children.length)
                children[oldVal].style.background = 'none';
            if (val < children.length)
                children[val].style.background = '#0000ff';

            this._onPropertyChanged(this, 'selectedIndex', val, oldVal);
        },
        value: function (name, val) {
            var oldVal = this._data['itemSource'];
            this._setter.itemSource(name,val);

            this._onPropertyChanged(this, 'value', val, oldVal);
        },
        itemSource: function (name, val) {
            var oldVal = this._data['itemSource'];


            this._onPropertyChanged(this, 'itemSource', val, oldVal);
        }
    }
});