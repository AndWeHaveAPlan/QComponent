/**
 * Created by ravenor on 13.07.16.
 */

var QObject = require('../../QObject');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

var ObservableSequence = require('observable-sequence');
var DQIndex = require('z-lib-structure-dqIndex');
var dequeue = require('z-lib-structure-dequeue');

module.exports = UIComponent.extend('ContainerComponent', {
    /**
     * 
     * @param {} item 
     * @param {} prevItem 
     * @param {} nextItem 
     * @param {} index 
     * @returns {} 
     */
    _itemAddEventHandler: function (item, prevItem, nextItem, index) {
        var newComp = this._wrapItem(item);
        this._handleChildren(newComp, index);
        this._children.splice(index, 0, newComp);
    },
    /**
     * 
     * @param {} item 
     * @param {} prevItem 
     * @param {} nextItem 
     * @param {} index 
     * @returns {} 
     */
    _itemRemoveEventHandler: function (item, prevItem, nextItem, index) {
        this._children.splice(index, 1);
    },
    /**
     * Wrap object in ItemTemplate
     * 
     * @param {Object} item 
     * @returns {} 
     */
    _wrapItem: function (item) {
        var template = this._data.itemTemplate;
        var newComp = new template();
        if ((typeof item != 'object') || Array.isArray(item)) {
            newComp.set('value', item);
        } else {
            for (var key in item)
                if (item.hasOwnProperty(key))
                    newComp.set(key, item[key]);
        }

        return newComp;
    },
    _handleChildren: function () { },
    _prop: {
        value: new Property('ContainerComponent', {},
            {
                get: function () {
                    return this;
                }
            }),
        selectionColor: new Property('String', { description: 'Selection color (css notation)' }, null, '#3b99fc'), //qiwi color
        selectedIndex: new Property('Number', { description: 'Index of current selected item' }, {
            set: function (name, val, oldVal) {
                if (val < 0) return;

                var children = this.el.childNodes;
                if (oldVal !== -1 && oldVal < children.length)
                    children[oldVal].style.background = 'none';
                if (val < children.length && val > -1)
                    children[val].style.background = this._data['selectionColor'];

                this.set('selectedItem', this.get('itemSource').get(val));
            },
            get: Property.defaultGetter
        }, -1),
        selectedItem: new Property('Variant', { description: 'Index of current selected item' }, {
            set: Property.defaultSetter,
            get: Property.defaultGetter
        }, {}),
        itemSource: new Property('Array', { description: 'Index of current selected item' }, {
            set: function (name, value, old, e) {
                //TODO unsubscribe methods
                //old.off('add', this._itemAddEventHandler.bind(this));
                //old.off('remove', this._itemRemoevEventHandler.bind(this));
                var self = this;
                var val = value;
                if (!(value instanceof ObservableSequence)) {
                    value = new ObservableSequence(new dequeue());
                    val.forEach(function (v) {
                        value.push(v);
                    });
                    e.value(value);
                }

                this._children.splice(0, this._children.length);

                value.forEach(function (item, i) {
                    var newComp = self._wrapItem(item);
                    self._handleChildren(newComp, i);
                    self._children.push(newComp);
                });

                value.on('add', this._itemAddEventHandler.bind(this));
                value.on('remove', this._itemRemoveEventHandler.bind(this));
            },
            get: Property.defaultGetter
        }, new ObservableSequence(new dequeue())),
        itemTemplate: new Property('ItemTemplate', { description: 'Visual presentation of items' }, {
            set: function (name, val) {
            },
            get: Property.defaultGetter
        }, QObject._knownComponents.ItemTemplate)
    }
});