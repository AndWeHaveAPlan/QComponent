/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function () {
    'use strict';
    var AbstractComponent = require('./AbstractComponent'),
        ContentContainer = require('./ContentContainer'),
        ObservableSequence = require('observable-sequence'),
        Property = require('../Property'),
        DQIndex = require('z-lib-structure-dqIndex');

    var UIComponent = AbstractComponent.extend('UIComponent', {

        createEl: function () {
            var self = this;
            if (!this.el) {
                this.el = AbstractComponent.document.createElement('div');
                this.el.style.overflow = 'hidden';
                this.el.style.position = 'relative';
            }

            this.el.addEventListener('click', function (e) {
                self.fire('click', e);
            });
            this.el.addEventListener('change', function () {
                self.fire('change');
            });
        },

        /**
         * Create own components
         *
         * @private
         */
        _init: function () {
            var iterator = this._ownComponents.iterator(), item, ctor, type, cmp;

            while (item = iterator.next()) {

                if (item)

                    if (item instanceof ContentContainer) {
                        this._contentContainer = item;
                    } else {
                        this._eventManager.registerComponent(item);
                    }

                this.el.appendChild(item.el);
            }
        },

        /**
         * Create children
         *
         * @private
         */
        _initChildren: function () {

            var iterator = new ObservableSequence(this.items || []).iterator(), item, ctor, type, cmp;

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
        },
        _prop: (function () {
            var out = ('left,right,top,bottom,height,width,float,border,overflow,margin,display'
                .split(',')
                .reduce(function (store, key) {
                    store[key] = Property.generate.cssProperty('Element`s css property ' + key);
                    return store;
                }, {}));
            out.disabled = new Property('Boolean', {description: 'disabled of element'}, {
                set: function (key, val, oldValue) {
                    if (!val) {
                        this.el.removeAttribute('disabled');
                    } else {
                        this.el.setAttribute('disabled', 'disabled');
                    }

                    this.el.disabled = val;
                },
                get: function (key, value) {
                    return value;
                }
            });
            out.type = Property.generate.attributeProperty('input type');
            return out;
        })()
    }, function (cfg) {
        var self = this;
        AbstractComponent.call(this, cfg);

        this._contentContainer = void(0);// this.el = document.createElement('div');

        /**
         * Child Components
         *
         * @type Array<AbstractComponent>
         * @private
         */

        this._children = new ObservableSequence(new DQIndex('id'));
        this._children.on('add', function (child) {
            child.parent = self;
            //insert to dom
            if (self._contentContainer && child.el) {
                self._contentContainer.el.appendChild(child.el);
            } else {
                self.el.appendChild(child.el);
            }
        });
        this._children.on('remove', function (child) {
            child.parent = null;
            if (self._contentContainer && child.el) {
                self._contentContainer.el.removeChild(child.el);
            } else {
                self.el.removeChild(child.el);
            }
        });

        this.createEl();
        this._init();
        this._initChildren();

    });

    return UIComponent;
})();