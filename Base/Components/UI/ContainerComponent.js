/**
 * Created by ravenor on 13.07.16.
 */

var QObject = require('../../QObject');
var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ItemTemplate = require('./ItemTemplate');
var ContentContainer = require('../ContentContainer');
var Property = require('../../Property');

var ObservableSequence = require('observable-sequence');

module.exports = UIComponent.extend('ContainerComponent', {
    _prop: {
        value: new Property('Variant', {description: 'Same as ItemSource', overrideKey: 'itemSource'}, {}, {}),

        selectedIndex: new Property('Number', {description: 'Index of current selected item'}, {
            set: function (name, val, oldVal) {
                var children = this.el.childNodes;
                if (oldVal != -1 && oldVal < children.length)
                    children[oldVal].style.background = 'none';
                if (val < children.length)
                    children[val].style.background = '#3b99fc'; //qiwi color

                this.set('selectedItem', this.get('itemSource')[val]);
            },
            get: Property.defaultGetter
        }, -1),
        selectedItem: new Property('Variant', {description: 'Index of current selected item'}, {
            set: function (name, val, oldVal) {},
            get: Property.defaultGetter

        }, {}),
        itemSource: new Property('Variant', {description: 'Index of current selected item'}, {
            set: function (name, val) {
                var template = QObject._knownComponents[this.get('itemTemplate')];

                this._children.splice(0, this._children.length);

                for (var i = 0, length = val.length; i < length; i++) {
                    var self = this;
                    var newComp = new template();

                    for (var key in val[i])
                        if (val[i].hasOwnProperty(key))
                            newComp.set(key, val[i][key]);

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
            },
            get: Property.defaultGetter
        }, {}),
        itemTemplate: new Property('String', {description: 'Visual presentation of items'}, {
            set: function (name, val) {
                var oldVal = this._data['itemTemplate'];
                this._itemTemplate = QObject._knownComponents[val];
            },
            get: Property.defaultGetter
        }, 'ItemTemplate')
    }
});