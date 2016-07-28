/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function () {
    'use strict';
    var AbstractComponent = require('./AbstractComponent'),
        ContentContainer = require('./ContentContainer'),
        observable = require('z-observable'),
        ObservableSequence = require('observable-sequence'),
        DQIndex = require('z-lib-structure-dqIndex');

    var UIComponent = AbstractComponent.extend('UIComponent', {
        on: observable.prototype.on,
        fire: observable.prototype.fire,

        createEl: function () {
            this.el = AbstractComponent.document.createElement('div');
            this.el.style.overflow = 'hidden';
            this.el.style.position = 'relative';
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

        _setter: {
            disabled: function (key, val) {
                var oldValue = this._data['disabled'];
                if (val === void 0) {
                    this.el.removeAttribute('disabled');
                } else {
                    this.el.setAttribute('disabled', val);
                }
                this._data['disabled'] = val;
                this._onPropertyChanged(this, 'disabled', val, oldValue);
            },
            left: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            right: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            top: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            bottom: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            height: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            width: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            float: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            overflow: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style[name] = val;
                } else {
                    this.el.style.removeProperty(name);
                }
            },
            visibility: function (name, val) {
                this._data[name] = val;
                if (val) {
                    this.el.style.display = val;
                }
            }
        }

    }, function (cfg) {
        var self = this;
        AbstractComponent.call(this, cfg);
        observable.prototype._init.call(this);

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