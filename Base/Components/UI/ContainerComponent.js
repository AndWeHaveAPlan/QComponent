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
var DQIndex = require('z-lib-structure-dqIndex');

module.exports = UIComponent.extend('ContainerComponent', {
    addItem: function (item, index) {
        var template = this._data.itemTemplate;
        var newComp = new template();
        if ((typeof item != 'object') || Array.isArray(item)) {
            newComp.set('value', item);
        } else {
            for (var key in item)
                if (item.hasOwnProperty(key))
                    newComp.set(key, item[key]);
        }

        this._handleChildren(newComp, this._children.length);

        this._children.push(newComp);
        //this._children.splice(index,0,newComp);

    },
    _handleChildren: function () { },
    _prop: {
        value: new Property('ContainerComponent', {},
        {
            get: function() {
                return this;
            }
        }),
        selectionColor: new Property('String', { description: 'Selection color (css notation)' }, null, '#3b99fc'), //qiwi color
        selectedIndex: new Property('Number', { description: 'Index of current selected item' }, {
            set: function (name, val, oldVal) {
                var children = this.el.childNodes;
                if (oldVal != -1 && oldVal < children.length)
                    children[oldVal].style.background = 'none';
                if (val < children.length)
                    children[val].style.background = this._data['selectionColor'];

                this.set('selectedItem', this.get('itemSource')[val]);
            },
            get: Property.defaultGetter
        }, -1),
        selectedItem: new Property('Variant', { description: 'Index of current selected item' }, {
            set: function (name, val, oldVal) {
            },
            get: Property.defaultGetter

        }, {}),
        itemSource: new Property('Array', { description: 'Index of current selected item' }, {
            set: function (name, val) {
                var self = this;
                var template = this._data.itemTemplate;//QObject._knownComponents[this.get('itemTemplate')];

                this._children.splice(0, this._children.length);

                for (var i = 0, length = val.length; i < length; i++) {
                    var newComp = new template();
                    if ((typeof val[i] != 'object') || Array.isArray(val[i])) {
                        newComp.set('value', val[i]);
                    } else {
                        for (var key in val[i])
                            if (val[i].hasOwnProperty(key))
                                newComp.set(key, val[i][key]);
                    }

                    this._handleChildren(newComp, i);

                    this._children.push(newComp);
                }
            },
            get: Property.defaultGetter
        }, []),
        itemTemplate: new Property('ItemTemplate', { description: 'Visual presentation of items' }, {
            set: function (name, val) {
            },
            get: Property.defaultGetter
        }, QObject._knownComponents.ItemTemplate)
    }
});