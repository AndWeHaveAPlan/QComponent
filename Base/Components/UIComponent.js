/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function () {
    'use strict';
    var AbstractComponent = require('./AbstractComponent'),
        observable = require('z-observable'),
        ObservableSequence = require('observable-sequence'),
        DQIndex = require('z-lib-structure-dqIndex'),
        Factory = new require('./Factory');

    var UIComponent = AbstractComponent.extend('UIComponent', {
        on: observable.prototype.on,
        fire: observable.prototype.fire,
        _factory: new Factory(),

        createEl: function () {
            this.el = document.createElement('div');
        },

        _initChildren: function () {

            var iterator = new ObservableSequence(this.items || []).iterator(), item, ctor, type, cmp,
                items = this.items = new ObservableSequence([]);

            this.preInit && this.preInit();

            while (item = iterator.next()) {
                if (typeof item === 'function')
                    ctor = item;
                else if (typeof item === 'object')
                    ctor = item.item;
                else {
                    ctor = item;
                    item = {_type: ctor};
                }

                item.parent = this;

                if ((type = typeof ctor) === 'function') {
                    cmp = (ctor._factory || this._factory).build(ctor, item, iterator);
                } else if (type === 'string') {
                    cmp = this._factory.build(ctor, item, iterator);
                }

                if (item.value) {
                    cmp.set('value', item.value);
                }

                this.addChild(cmp);
            }
        },

        /**
         * @override
         * Add Child component
         *
         * @param component AbstractComponent: AbstractComponent to add
         */
        addChild: function (component) {
            this._children.push(component);
            return this;
        }

    }, function (cfg) {
        var self = this;
        AbstractComponent.call(this, cfg);
        observable.prototype._init.call(this);

        /**
         * Child Components
         *
         * @type Array<AbstractComponent>
         * @private
         */
        this._children = new ObservableSequence(new DQIndex('id'));

        this.createEl();
        this._initChildren();

        this._children.on('add', function (child) {
            child.parent = self;
            //insert to dom
            child.el && self.el.appendChild(child.el);
        });
        this._children.on('remove', function (child) {
            child.parent = null;
            self.removeFromTree(child);
        });

    });

    return UIComponent;
})();