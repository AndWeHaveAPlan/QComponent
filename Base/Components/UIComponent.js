/**
 * Created by zibx on 01.07.16.
 */

matrix = {
    multiply: function (m1, m2) {
        var mRet = [[], [], []];

        mRet[0][0] = m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0];
        mRet[0][1] = m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1];
        mRet[0][2] = m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2];
        mRet[1][0] = m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0];
        mRet[1][1] = m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1];
        mRet[1][2] = m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2];
        mRet[2][0] = m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0];
        mRet[2][1] = m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1];
        mRet[2][2] = m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2];

        return mRet;
    },
    createEmpty: function () {
        return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    },
    createRotation: function (a) {
        var cos = Math.cos;
        var sin = Math.sin;
        return [[cos(a), sin(a), 0], [-sin(a), cos(a), 0], [0, 0, 1]];
    },
    createTranslation: function (x, y) {
        return [[1, 0, 0], [0, 1, 0], [x, y, 1]];
    },
    createScale: function (x, y) {
        return [[x, 0, 0], [0, y, 0], [0, 0, 1]];
    },
    createScew: function (x, y) {
        return [[1, x, 0], [y, 1, 0], [0, 0, 1]];
    },
    toStyleString: function (m) {
        return 'matrix(' + [m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]].join(',') + ')';
    }
};

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
            this.el.addEventListener('mouseenter', function () {
                self.fire('mouseenter');
            });
            this.el.addEventListener('mouseleave', function () {
                self.fire('mouseleave');
            });
            this.el.addEventListener('mousemove', function () {
                self.fire('mousemove');
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

                if (item instanceof UIComponent)
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
            var out = ('left,right,top,bottom,height,width,float,border,overflow,overflow-x,overflow-y,margin,display,background,color,padding,transform-origin,transition,position,border-radius'
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
                get: Property.defaultGetter
            });
            out.rotation = new Property('Number', {description: 'Component rotation (angle, in degrees)'}, {
                set: function (key, val, oldValue) {
                    var m = matrix.createRotation((val / 180) * Math.PI);
                    this.el.style.transform = matrix.toStyleString(m);
                },
                get: Property.defaultGetter
            });
            out.translation = new Property('Array', {description: 'Component translation ([x,y] in "pixels")'}, {
                set: function (key, val, oldValue) {
                    var m = matrix.createTranslation(val[0],val[1]);
                    this.el.style.transform = matrix.toStyleString(m);
                },
                get: Property.defaultGetter
            });
            out.scale = new Property('Array', {description: 'Component scale ([x,y] relative)'}, {
                set: function (key, val, oldValue) {
                    var m = matrix.createScale(val[0],val[1]);
                    this.el.style.transform = matrix.toStyleString(m);
                },
                get: Property.defaultGetter
            });
            out.scew = new Property('Array', {description: 'Component scew ([x,y] relative)'}, {
                set: function (key, val, oldValue) {
                    var m = matrix.createScew(val[0],val[1]);
                    this.el.style.transform = matrix.toStyleString(m);
                },
                get: Property.defaultGetter
            });
            out.transform = new Property('Array', {description: 'Complex transform'}, {
                set: function (key, val, oldValue) {
                    this._transformMatrix = matrix.createEmpty();

                    for (var i = 0; i < val.length; i++) {
                        var m = matrix.createEmpty();
                        var cVal = val[i];
                        switch (cVal.type) {
                            case 'rotation':
                                m = matrix.createRotation((cVal.angle / 180) * Math.PI);
                                break;
                            case 'translation':
                                m = matrix.createTranslation(cVal.x, cVal.y);
                                break;
                            case 'scale':
                                m = matrix.createScale(cVal.x, cVal.y);
                                break;
                            case 'scew':
                                m = matrix.createScew(cVal.x, cVal.y);
                                break;
                        }

                        this._transformMatrix = matrix.multiply(this._transformMatrix, m);
                    }
                    this.el.style.transform = matrix.toStyleString(this._transformMatrix);
                },
                get: function (key, value) {
                    return value;
                }
            });
            return out;
        })()
    }, function (cfg) {
        var self = this;
        AbstractComponent.call(this, cfg);

        this._contentContainer = void(0);

        this._transformMatrix = matrix.createEmpty();

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
            if (child.el) { /** UI Component */
                if (self._contentContainer && child.el) {
                    self._contentContainer.el.appendChild(child.el);
                } else {
                    self.el.appendChild(child.el);
                }
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