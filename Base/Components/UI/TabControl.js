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
        headerTemplate: new Property('ItemTemplate', { description: 'Visual presentation of items' }, {
            set: function (name, val) {
                this._headersList.set('itemTemplate', val);
            },
            get: Property.defaultGetter
        }, ItemTemplate)
    },
    _onChildAdd: function (child) {
        child.parent = this;
        if (child instanceof Tab) {
            var header = child.get('value');
            this._tabs[header] = child;
            this._headersList.get('itemSource').push(header);
        }
        this.bubble('childAdded', { child: child });
    },
    _onChildRemove: function (child) {
        child.parent = null;
        this.bubble('childRemoved', { child: child });
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);

        this._tabs = {};

        var vbox = new VBox({
            id: 'hbox',
            height: '100%',
            width: '100%',
            flexDefinition: '50px *'
        });
        this._ownComponents.push(vbox);
        this._vbox = vbox;

        var headersList = new ListBox({
            orientation: 'horizontal',
            height: '100%',
            width: '100%',
            itemTemplate: ItemTemplate.extend('ItemTemplate' + this.id, {}, function (cfg) {
                cfg = cfg || {};
                cfg.padding = '12px';
                ItemTemplate.call(this, cfg);
                //this.set('padding','12px');
            })
        });

        headersList.set('itemTemplate', ItemTemplate.extend('ItemTemplate' + this.id, {}, function (cfg) {
            cfg = cfg || {};
            cfg.padding = '12px';
            ItemTemplate.call(this, cfg);
            //this.set('padding','12px');
        }));
        this._vbox.addChild(headersList);
        this._headersList = headersList;

        var self = this;
        this._headersList.on('selectionChanged', function () {
            var selItem = self._headersList.get('selectedItem');
            var presenterEl = self._presenter.el;

            presenterEl.innerHTML = '';
            presenterEl.appendChild(self._tabs[selItem].el);
            self._tabs[selItem].updateLayout();
        });

        var presenter = new Primitive.div({
            height: '100%',
            width: '100%'
        });
        this._vbox.addChild(presenter);
        this._presenter = presenter;

    });