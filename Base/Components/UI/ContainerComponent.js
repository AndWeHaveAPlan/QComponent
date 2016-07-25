/**
 * Created by ravenor on 13.07.16.
 */

var QObject = require('../../QObject');
var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ItemTemplate = require('./ItemTemplate');
var ContentContainer = require('../ContentContainer');

var ObservableSequence = require('observable-sequence');

module.exports = UIComponent.extend('ContainerComponent', {
    /**
     * Create own components
     *
     * @private
     */
    _init: function () {
        var iterator = this._ownComponents.iterator(), item, ctor, type, cmp;

        while (item = iterator.next()) {

            if (item instanceof ItemTemplate) {
                this._itemTemplate = item;
                continue;
            }

            if (item)
                if (item instanceof ContentContainer) {
                    this._contentContainer = item;
                } else {
                    this._eventManager.registerComponent(item);
                }

            this.el.appendChild(item.el);
        }
    },
    addChild: function (child) {

        if (child instanceof ItemTemplate) {
            this._itemTemplate = child;
        } else {
            this._children.push(child);
        }

        return this;
    },
    _getter: {
        selectedIndex: function (name, val) {
            return this._data['selectedIndex'];
        },
        selectedItem: function (name, val) {
            return this._data['selectedItem'];
        },
        value: function (name, val) {
            this._setter.itemSource(name, val);
        },
        itemSource: function (name, val) {
            return this._data['itemSource'];
        }
    },
    _setter: {
        selectedIndex: function (name, val) {
            var oldVal = this._data['selectedIndex'];
            this._data['selectedIndex'] = val;

            this._data['selectedItem'] = this._children.get(val);

            var children = this.el.childNodes;
            if (oldVal != void(0) && oldVal < children.length)
                children[oldVal].style.background = 'none';
            if (val < children.length)
                children[val].style.background = '#0000ff';

            this._onPropertyChanged(this, 'selectedItem', this._data['selectedItem'], void 0);
            this._onPropertyChanged(this, 'selectedIndex', val, oldVal);
        },
        value: function (name, val) {
            var oldVal = this._data['itemSource'];
            this._setter.itemSource(name, val);

            this._onPropertyChanged(this, 'value', val, oldVal);
        },
        itemSource: function (name, val) {
            var oldVal = this._data['itemSource'];
            var template = this._itemTemplate;

            for (var i = 0, length = val.length; i < length; i++) {
                var self = this;
                var newComp = new UIComponent();
                newComp._children = template._children;
                newComp.el = template.el.cloneNode(true);
                newComp._data = val[i];

                var childNode = newComp.el;
                childNode.style.clear = 'both';
                childNode.style.position = 'relative';

                (function (index) {
                    childNode.addEventListener('click', function () {
                        self.set('selectedIndex', index);
                    });
                })(i);

                this._children.push(newComp);
            }
            this._data['itemSource'] = val;
            this._onPropertyChanged(this, 'itemSource', val, oldVal);
        }
    }
});