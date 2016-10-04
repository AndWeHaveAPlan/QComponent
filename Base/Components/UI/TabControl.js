/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');
var Tab = require('./Tab');
var ListBox = require('./ListBox');
var HBox = require('./HBox');
var VBox = require('./VBox');
var Property = require('../../Property');
var ItemTemplate = require('./ItemTemplate');

module.exports = UIComponent.extend('TabControl', {
    _prop: {
        itemWidth: new Property('String', { description: 'Single item width' }, null, 'auto'),
        headerTemplate: new Property('ItemTemplate', {
            set: function (name, value) {
                this._headersList.set('itemTemplate', value);
            },
            description: 'Visual presentation of items',
            defaultValue: ItemTemplate
        }),
        selectedIndex: new Property('Number', {
            get: function () {
                return this._headersList.get('selectedIndex');
            },
            set: function (name, value) {
                this._headersList.set('selectedIndex', value);
            },
            defaultValue: 0
        }),
        tabsPosition: new Property('String', {
            set: function (name, value) {

                this._headersList.set('top', 0);
                this._headersList.set('right', 0);
                this._headersList.set('left', 0);
                this._headersList.set('bottom', 0);

                this._presenter.set('top', 0);
                this._presenter.set('bottom', 0);
                this._presenter.set('right', 0);
                this._presenter.set('left', 0);

                switch (value) {
                    case 'top':
                        this._headersList.set('bottom');
                        this._headersList.set('orientation', 'horizontal');
                        this._presenter.set('top');
                        break;
                    case 'bottom':
                        this._headersList.set('top', 0);
                        this._headersList.set('right', 0);
                        this._headersList.set('left', 0);
                        this._headersList.set('orientation', 'horizontal');

                        this._presenter.set('bottom', 0);
                        this._presenter.set('right', 0);
                        this._presenter.set('left', 0);
                        break;
                    case 'left':
                        this._headersList.set('right');
                        this._headersList.set('orientation', 'vertical');
                        this._presenter.set('left');
                        break;
                    case 'right':
                        this._headersList.set('top', 0);
                        this._headersList.set('bottom', 0);
                        this._headersList.set('right', 0);
                        this._headersList.set('orientation', 'vertical');

                        this._presenter.set('bottom', 0);
                        this._presenter.set('left', 0);
                        this._presenter.set('top', 0);
                        break;
                }
                this.updateLayout();
            },
            defaultValue: 'top'
        })

    },
    updateLayout: function () {
        if (this._data.tabsPosition === 'top' || this._data.tabsPosition === 'bottom') {
            var headerHeight = this._headersList.el.clientHeight;
            this._presenter.set('height', (this.el.clientHeight - headerHeight) + 'px');
            this._presenter.set('width', '100%');
        }

        if (this._data.tabsPosition === 'left' || this._data.tabsPosition === 'right') {
            var headerWidth = this._headersList.el.clientWidth;
            this._presenter.set('width', (this.el.clientWidth - headerWidth) + 'px');
            this._presenter.set('height', '100%');
        }

        UIComponent.prototype.updateLayout.call(this);
    },
    _onChildAdd: function (child, i) {
        child.parent = this;
        if (child instanceof Tab) {
            var header = child.get('value');
            this._tabs[header] = child;
            this._headersList.get('itemSource').push({ value: header, active: false });
        }
        this._setSelectedTab();
        this.updateLayout();
        this.bubble('childAdded', { child: child });
    },
    _onChildRemove: function (child) {
        child.parent = null;
        this.bubble('childRemoved', { child: child });
    },
    _setSelectedTab: function (key) {
        var selItem = this._headersList.get('selectedItem');

        if (!selItem) return;

        var presenterEl = this._presenter.el;

        if (!this._tabs[selItem.value] || this._currentSelection === selItem) return;

        presenterEl.innerHTML = '';
        presenterEl.appendChild(this._tabs[selItem.value].el);
        this._currentSelection = selItem;
        this._tabs[selItem.value].updateLayout();
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);

        this._tabs = {};

        var headersList = new ListBox({
            orientation: 'horizontal',
            position: 'absolute'
        });
        this._ownComponents.push(headersList);
        this._headersList = headersList;

        var self = this;
        this._headersList.on('selectionChanged', function () {
            self._setSelectedTab();
            self.set('selectedIndex', self._headersList.get('selectedIndex'));
        });

        var presenter = new Primitive.div({
            position: 'absolute'
        });
        this._ownComponents.push(presenter);
        this._presenter = presenter;

    });