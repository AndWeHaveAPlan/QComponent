/**
 * Created by zibx on 01.07.16.
 */

var Matrix2D = require('../Common/Matrix2D');

module.exports = (function () {
    'use strict';
    var AbstractComponent = require('./AbstractComponent'),
        ContentContainer = require('./ContentContainer'),
        ObservableSequence = require('observable-sequence'),
        Property = require('../Property');

    var UIComponent = AbstractComponent.extend('UIComponent', {

        createEl: function () {
            var self = this;
            if (!this.el) {
                this.el = AbstractComponent.document.createElement('div');
                this.el.style.overflow = 'hidden';
                this.el.style.position = 'relative';
            }

            this.el.addEventListener('click', function (e, target) {
                if (self.fire('click', e) !== false)
                    self.parent && self.parent.fire('click', e, target || self);
                e.stopPropagation();
            });
            this.el.addEventListener('change', function (e) {
                self.fire('change', e);
            });
            this.el.addEventListener('mouseenter', function (e) {
                self.fire('mouseenter', e);
            });
            this.el.addEventListener('mouseleave', function (e) {
                self.fire('mouseleave', e);
            });
            this.el.addEventListener('mousemove', function (e) {
                self.fire('mousemove', e);
            });
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

        _prop: (function () {
            var out = ('left,right,top,bottom,height,width,float,border,overflow,margin,background,color,padding,transform-origin,transition,position,border-radius,font-family,font-size'
                .split(',')
                .reduce(function (store, key) {
                    store[key] = Property.generate.cssProperty('Element`s css property ' + key);
                    return store;
                }, {}));
            out.scroll = new Property('String', {description: 'visibility of element'}, {
                set: function (key, val, oldValue) {
                    switch (val) {
                        case 'none':
                            this.el.style.overflowX = 'hidden';
                            this.el.style.overflowY = 'hidden';
                            break;
                        case 'horizontal':
                            this.el.style.overflowX = 'auto';
                            this.el.style.overflowY = 'hidden';
                            break;
                        case 'vertical':
                            this.el.style.overflowX = 'hidden';
                            this.el.style.overflowY = 'auto';
                            break;
                        case 'both':
                            this.el.style.overflowX = 'auto';
                            this.el.style.overflowY = 'auto';
                            break;
                    }
                },
                get: Property.defaultGetter
            }, 'visible');
            out.visibility = new Property('String', {description: 'visibility of element'}, {
                set: function (key, val, oldValue) {
                    switch (val) {
                        case 'visible':
                            this.el.style.display = 'initial';
                            break;
                        case 'hidden ':
                            this.el.style.display = 'initial';
                            this.el.style.opacity = 0;
                            break;
                        case 'collapsed':
                            this.el.style.display = 'none';
                            break;
                    }
                },
                get: Property.defaultGetter
            }, 'visible');
            out.enabled = new Property('Boolean', {description: 'disabled of element'}, {
                set: function (key, val, oldValue) {
                    if (val) {
                        this.el.removeAttribute('disabled');
                    } else {
                        this.el.setAttribute('disabled', 'disabled');
                    }
                    this.el.disabled = !val;
                },
                get: Property.defaultGetter
            }, 'true');
            out.rotation = new Property('Number', {description: 'Component rotation (angle, in degrees)'}, {
                set: function (key, val, oldValue) {
                    var m = Matrix2D.createRotation((val / 180) * Math.PI);
                    this.el.style.transform = m.toStyleString();
                },
                get: Property.defaultGetter
            });
            out.translation = new Property('Array', {description: 'Component translation ([x,y] in "pixels")'}, {
                set: function (key, val, oldValue) {
                    var m = Matrix2D.createTranslation(val[0], val[1]);
                    this.el.style.transform = m.toStyleString();
                },
                get: Property.defaultGetter
            });
            out.scale = new Property('Array', {description: 'Component scale ([x,y] relative)'}, {
                set: function (key, val, oldValue) {
                    var m = Matrix2D.createScale(val[0], val[1]);
                    this.el.style.transform = m.toStyleString();
                },
                get: Property.defaultGetter
            });
            out.skew = new Property('Array', {description: 'Component skew ([x,y] relative)'}, {
                set: function (key, val, oldValue) {
                    var m = Matrix2D.createSkew(val[0], val[1]);
                    this.el.style.transform = m.toStyleString();
                },
                get: Property.defaultGetter
            });
            out.transform = new Property('Array', {description: 'Complex transform'}, {
                set: function (key, val, oldValue) {
                    this._transformMatrix = Matrix2D.createEmpty();
                    for (var i = 0; i < val.length; i++) {
                        var m = Matrix2D.createEmpty();
                        var cVal = val[i];
                        switch (cVal.type) {
                            case 'rotation':
                                m = Matrix2D.createRotation((cVal.angle / 180) * Math.PI);

                                break;
                            case 'translation':
                                m = Matrix2D.createTranslation(cVal.x, cVal.y);
                                break;
                            case 'scale':
                                m = Matrix2D.createScale(cVal.x, cVal.y);
                                break;
                            case 'skew':
                                m = Matrix2D.createSkew(cVal.x, cVal.y);
                                break;
                        }

                        this._transformMatrix = this._transformMatrix.multiply(m);
                    }
                    this.el.style.transform = this._transformMatrix.toStyleString();
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

        this._children.on('add', function (child) {
            if (child.el) {
                if (self._contentContainer) {
                    self._contentContainer.el.appendChild(child.el);
                } else {
                    self.el.appendChild(child.el);
                }
            }
        });

        this._ownComponents.on('add', function (child) {
            if (child.el)
                self.el.appendChild(child.el);
        });

        this._contentContainer = void(0);
        this._transformMatrix = Matrix2D.createEmpty();
        this.createEl();
        this._initChildren();
        if (this.el && this.el.setAttribute) {
            this.el.setAttribute('qId', this.id);
            this.el.setAttribute('qType', this._type);
        }
    });

    return UIComponent;
})();