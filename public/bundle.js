(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Base = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Some kind of namespace
 *
 * @type {{QObject: (QObject|exports|module.exports), Component: (AbstractComponent|exports|module.exports), Pipe: (Pipe|exports|module.exports)}}
 */
module.exports = {
    QObject: require("./Base/QObject"),
    Component: {
        AbstractComponent: require("./Base/Components/AbstractComponent"),
        UIComponent: require("./Base/Components/UIComponent"),
        ContentContainer: require('./Base/Components/ContentContainer'),
        UI: {
            Primitives: require('./Base/Components/UI/Primitives'),
            Checkbox: require('./Base/Components/UI/Checkbox'),
            ListBox: require('./Base/Components/UI/ListBox'),
            HBox: require('./Base/Components/UI/HBox'),
            NumberKeyboard: require('./Base/Components/UI/NumberKeyboard')
        },
        Factory: require("./Base/Components/Factory"),
        Logical: {
            LogicalComponent: require('./Base/Components/Logical/LogicalComponent'),
            Branch: require('./Base/Components/Logical/Branch'),
            Gate: require('./Base/Components/Logical/Gate'),
            Timer: require('./Base/Components/Logical/Timer')
        }
    },
    EventManager: require("./Base/EventManager"),
    Property: require("./Base/Property"),
    Pipes: {
        AbstractPipe: require("./Base/Pipes/AbstractPipe"),
        SimplePipe: require("./Base/Pipes/SimplePipe"),
        FiltratingPipe: require("./Base/Pipes/FiltratingPipe"),
        MutatingPipe: require("./Base/Pipes/MutatingPipe")
    }
};
},{"./Base/Components/AbstractComponent":2,"./Base/Components/ContentContainer":3,"./Base/Components/Factory":4,"./Base/Components/Logical/Branch":5,"./Base/Components/Logical/Gate":6,"./Base/Components/Logical/LogicalComponent":7,"./Base/Components/Logical/Timer":8,"./Base/Components/UI/Checkbox":9,"./Base/Components/UI/HBox":11,"./Base/Components/UI/ListBox":13,"./Base/Components/UI/NumberKeyboard":14,"./Base/Components/UI/Primitives":15,"./Base/Components/UIComponent":16,"./Base/EventManager":17,"./Base/Pipes/AbstractPipe":19,"./Base/Pipes/FiltratingPipe":20,"./Base/Pipes/MutatingPipe":21,"./Base/Pipes/SimplePipe":22,"./Base/Property":23,"./Base/QObject":24}],2:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    MulticastDelegate = require('../MulticastDelegate'),
    Property = require('../Property');

/**
 * Base class for all components
 * @param cfg.parent Component: Parent component
 * @param cfg.id String: Component unique id
 * @param [cfg.leaf] Boolean: True if component may have children
 * @constructor
 */
function AbstractComponent(cfg) {

    var self = this;
    Function.prototype.apply.call(QObject, this, arguments);

    if (!this.id)
        this.id = uuid();

    /**
     *
     * @type {{}}
     * @private
     */
    this._data = {};

    /**
     * Own Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._ownComponents = new ObservableSequence(new DQIndex('id'));

    if (!this.leaf) {
        /** instantly modify child components on append */
        this._ownComponents.on('add', function (child) {
            child.parent = self;
        });
    }
    
    this._initProps(cfg || {});
    
    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = new MulticastDelegate();

    if (!this._eventManager)
        this._eventManager = new EventManager();

    this._eventManager.registerComponent(this);
}
var defaultPropertyFactory = new Property('Variant', {description: 'Someshit'});
AbstractComponent.document = QObject.document;
AbstractComponent.extend = QObject.extend;
AbstractComponent.prototype = Object.create(QObject.prototype);
QObject.prototype.apply(AbstractComponent.prototype, {
    
    _initProps: function (cfg) {
        var prop = this._prop, i,
            newProp = this._prop = {};
        for( i in prop ) {
            if(i === 'default') {
                newProp[i] = prop[i];
            }else if (i in cfg) {
                newProp[i] = new prop[i](this, i, cfg[i]);
            }else
                newProp[i] = new prop[i](this, i);
        }
    },
    
    regenId:function(){
        this.id = uuid();
    },

    _prop: {},

    /**
     * Get property from component
     *
     * @param name String
     */
    get: function (name) {

        var nameParts = name.split('.');
        var ret = this;

        if (nameParts.length > 1) {
            for (var i = 0; i < nameParts.length; i++) {
                if (ret instanceof AbstractComponent) {
                    ret = ret.get(nameParts[i]);
                } else {
                    ret = ret[nameParts[i]];
                }

                if (ret == void 0)
                    return ret;
            }

            return ret;

        } else {
            /*var accesor = this._prop[name] || this._getter[name] || this._getter.default;
            return accesor.call(this, name);*/
            return name in this._prop ? this._prop[name].get() : void 0 ;
        }
    },

    /**
     * Set property to component
     *
     * @param name String
     * @param value Object
     */
    set: function (name, value) {
        var nameParts = name.split('.');

        if (nameParts.length > 1) {
            var getted = this.get(nameParts.slice(0, nameParts.length - 1).join('.'));
            if (getted)
                if (getted instanceof AbstractComponent) {
                    getted.set(nameParts.unshift(), value);
                } else {
                    getted[nameParts[nameParts.length - 1]] = value;
                    this._onPropertyChanged(nameParts.splice(0, 1), value);
                }
        } else {
            if(!this._prop[name]){
                this._prop[name] = new (this._prop.default || defaultPropertyFactory)(this, name);
            }
            return this._prop[name].set(value);
        }

        return this;
    },

    /**
     * Subscribe to _onPropertyChanged event
     *
     * @param callback Function
     */
    subscribe: function (callback) {
        this._onPropertyChanged.addFunction(callback);
    },

    /**
     * Add Child component
     *
     * @param component AbstractComponent: AbstractComponent to add
     */

    _type: 'AbstractComponent'
});

AbstractComponent._type = AbstractComponent.prototype._type;

/** properties that need deep applying */


QObject._knownComponents['AbstractComponent'] = module.exports = AbstractComponent;
},{"../MulticastDelegate":18,"../Property":23,"./../EventManager":17,"./../QObject":24,"observable-sequence":25,"tiny-uuid":26,"z-lib-structure-dqIndex":28}],3:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var AbstractComponent = require('./AbstractComponent');

/**
 *
 */
module.exports = AbstractComponent.extend('ContentContainer', {
    
}, function (cfg) {
    AbstractComponent.call(this, cfg);

    this.el = AbstractComponent.document.createElement('div');
});
},{"./AbstractComponent":2}],4:[function(require,module,exports){
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 15 May 2016.
//@exports Factory
module.exports = (function () {

    /*
    Factory. define, load and instantiate components
     @arg [cfg]<object>: factory configuration
     @arg [cfg.versionControl=false]<boolean>: algorithm of component versioning. If false - factory would throw error on second definition of same component
     */
    var component = require('./AbstractComponent'),
        QObject = require('../QObject' ),
        Factory = function (cfg) {
            this.apply(cfg);
            this.cmps = QObject._knownComponents;
            this.stats = {};
            var _self = this;
            this.destroyCallback = function () {
                _self.destroy(this);
            };
        };

    Factory.prototype = new QObject({
        versionControl: false,
        versionComparator: function (a, b) {
            a = (a||'0.0.0').split('.');
            b = (b||'0.0.0').split('.');
            var i, _i, aI, bI;
            for( i = 0, _i = Math.max(a.length, b.length); i < _i; i++){
                aI = parseInt(a[i], 10)|0;
                bI = parseInt(b[i], 10)|0;
                if(aI !== bI)
                    return aI < bI ? -1 : 1;
            }
            return 0;
        },

        /**
        Factory.define - define component
         @arg name<string>: component constructor name
         @arg cfg<object>: component configuration (goes to prototype)
         @arg [cfg._version]<string>: component version
         @arg [init]<function>: component constructor
         */
        define: function (name, cfg, init) {
            var cmps = this.cmps,
                _self = this,
                builder;
            if(cmps[name]) {
                if(this.versionControl){
                    throw new Error('component ' + name + ' is already defined');
                }else{
                    if(this.versionComparator(cmps[name]._version, cfg._version) > 0){
                        console.warn('component ' + name + ' is already defined, return v'+ cmps[name]._version +', tried to load v'+ cfg._version);
                        return cmps[name];
                    }else{
                        console.warn('component ' + name + ' is already defined, overwrite old v'+ cmps[name]._version +', by new one v'+ cfg._version)
                    }
                }
            }
            builder = function( cfg, iter ){
                return _self.build(name, cfg, iter);
            };
            cfg._type = name;
            cmps[name] = ComponentConstructorFactory(cfg, init);
            cmps[name].prototype._factory = cmps[name]._factory = this;
            builder._type = cmps[name].prototype._type = cmps[name]._type = name;
            return builder;
        },
        build: function (what, cfg){
            cfg = cfg || {};

            if( typeof what === 'string' )
                cfg._type = what;
            else if(typeof what === 'function'){
                cfg._type = what._type;
            }else
                cfg = what;

            var node = cfg.node,
            //params = brick.tokenize.paramsExtractor(node, true),
                cmps = this.cmps,
                stats = this.stats,
                constructor = cmps[cfg._type];
            //console.log(cfg._type)
            if(typeof constructor !== 'function')
                throw new Error(cfg._type+'|'+what);

            var cmp = new constructor( cfg );


            stats[cmp._type] = (stats[cmp._type] | 0) + 1;

            cmp.on( 'destroy', this.destroyCallback );
            return cmp;
        },
        destroy: function (cmp) {
            var type = cmp._type,
                stats = this.stats;
            stats[type]--;
        }
    });
    return Factory;
})();

},{"../QObject":24,"./AbstractComponent":2}],5:[function(require,module,exports){
module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Branch = LogicalComponent.extend('Branch', {
        _prop: {
            input: new Property('Boolean', {description: 'start date'}, {
                set: function (name, value) {

                    if (value)
                        this.set('ifTrue', true);
                    else
                        this.set('ifFalse', false);
                }
            }),
            ifTrue: new Property('Boolean', {description: 'start date'}),
            ifFalse: new Property('Boolean', {description: 'start date'})
        },
        _setter: {
            input: function (name, value) {
                if (!!value)
                    this.set('ifTrue');
                else
                    this.set('ifFalse');
            },
            ifTrue: function () {
                this._onPropertyChanged(this, 'ifTrue', true, void(0));
            },
            ifFalse: function () {
                this._onPropertyChanged(this, 'ifFalse', false, void(0));
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Branch;
})();
},{"../../Property":23,"./LogicalComponent":7}],6:[function(require,module,exports){
module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Gate = LogicalComponent.extend('Branch', {


        _prop: {
            input: new Property('Variant', {description: 'start date'}, {
                set: function (name, value) {

                    if (this.get('open')===true)
                        this.set('output', value);
                }
            }),
            open: new Property('Boolean', {description: 'start date'})
        },

        _setter: {
            input: function (name,val) {
                if (this.open) {
                    var prev = this._data['value'];
                    this._data['value'] = val;
                    this._onPropertyChanged(this, 'output', this._data['value'], prev);
                }
            },
            open: function () {
                var prev = tris.open;
                this.open = true;
                this._onPropertyChanged(this, 'open', true, prev);
            },
            close: function () {
                var prev = this.open;
                this.open = false;
                this._onPropertyChanged(this, 'open', false, prev);
            },
            toggle: function () {
                this.open = !this.open;
                this._onPropertyChanged(this, 'open', this.open, !this.open);
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Gate;
})();
},{"../../Property":23,"./LogicalComponent":7}],7:[function(require,module,exports){


module.exports = (function(){
    'use strict';
    var AbstractComponent = require('../AbstractComponent');

    var LogicalComponent = AbstractComponent.extend('LogicalComponent', {

    }, function( cfg ){
        AbstractComponent.call(this, cfg);
    });

    return LogicalComponent;
})();
},{"../AbstractComponent":2}],8:[function(require,module,exports){
module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Timer = LogicalComponent.extend('Timer', {

        _intervalObj: void(0),

        _tick: function (self) {
            return function () {
                self.set('tick', true);
            };
        },

        _prop: {
            start: new Property('Variant', {description: 'start date'}, {
                set: function (name, value) {
                    
                    if (value)
                        this.set('interval', value);

                    if (this._intervalObj)
                        clearInterval(this._intervalObj);

                    var int = this.get('interval');
                    var t = this._tick(this);
                    this._intervalObj = setInterval(t, int);
                }
            }),
            stop: new Property('Variant', {description: 'stop timer'}, {
                set:function (name, value) {
                    if (this._intervalObj)
                        clearInterval(this._intervalObj);

                    this._onPropertyChanged(this, 'stop', true, void(0));
                }
            }),
            interval: new Property('Variant', {description: 'timer interval'}, {
                set: function (name, value) {},
                get: Property.defaultGetter
            }),
            tick: new Property('Boolean', {description: 'timer interval'}, {})
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._data.interval = 1000;
    });

    return Timer;
})();
},{"../../Property":23,"./LogicalComponent":7}],9:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');


module.exports = UIComponent.extend('Checkbox', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.el.setAttribute('type', 'checkbox');
        this.el.addEventListener('click', function (event) {
            self.set('checked', this.checked);
        });
    },
    _setter: {
        checked: function (key, value) {
            var oldVal = this._data.checked;
            this._data.checked = !!value;

            this.el.checked = this._data.checked;

            this._onPropertyChanged(this, 'value', this._data.checked, oldVal);
            this._onPropertyChanged(this, 'checked', this._data.checked, oldVal);
        },
        value: function (key, value) {
            this.set('checked', value)
        }
    },
    _getter: {
        checked: function () {
            return this._data.checked;
        },
        value: function () {
            return this._data.checked;
        }
    }
});
},{"../UIComponent":16,"./Primitives":15}],10:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var QObject = require('../../QObject');
var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ItemTemplate = require('./ItemTemplate');
var ContentContainer = require('../ContentContainer');

var ObservableSequence = require('observable-sequence');

module.exports = UIComponent.extend('ContainerComponent', {
    _getter: {
        selectedIndex: function (name, val) {
            return this._data['selectedIndex'];
        },
        selectedItem: function (name, val) {
            return this._data['selectedItem'];
        },
        value: function (name, val) {
            this._setter.itemSource(name, val);
        },
        itemSource: function (name, val) {
            return this._data['itemSource'];
        },
        itemTemplate: function (name, val) {
            return this._data['itemTemplate'];
        }
    },
    _setter: {
        selectedIndex: function (name, val) {
            var oldVal = this._data['selectedIndex'];
            this._data['selectedIndex'] = val;

            this._data['selectedItem'] = this._children.get(val);

            var children = this.el.childNodes;
            if (oldVal != void(0) && oldVal < children.length)
                children[oldVal].style.background = 'none';
            if (val < children.length)
                children[val].style.background = '#3b99fc'; //59 153 252

            this._onPropertyChanged(this, 'selectedItem', this._data['selectedItem'], void 0);
            this._onPropertyChanged(this, 'selectedIndex', val, oldVal);
        },
        value: function (name, val) {
            var oldVal = this._data['itemSource'];
            this._setter.itemSource(name, val);

            this._onPropertyChanged(this, 'value', val, oldVal);
        },
        itemSource: function (name, val) {
            var oldVal = this._data['itemSource'];
            var template = this._itemTemplate;

            this._children.splice(0, this._children.length);

            for (var i = 0, length = val.length; i < length; i++) {
                var self = this;
                var newComp = new UIComponent();
                newComp = new template();

                for (var key in val[i])
                    if (val[i].hasOwnProperty(key))
                        newComp.set(key, val[i][key]);

                //newComp._data = val[i];

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
            this._data['itemSource'] = val;
            this._onPropertyChanged(this, 'itemSource', val, oldVal);
        },
        itemTemplate: function (name, val) {
            var oldVal = this._data['itemTemplate'];
            this._itemTemplate = QObject._knownComponents[val];

            this._onPropertyChanged(this, 'itemTemplate', val, oldVal);
        },
        selectedItem: function (name, val) {
            var oldVal = this._data['selectedItem'];
            //this._data['selectedItem'] = val;

            var itemComponent = this._children.get(this.get('selectedIndex'));

            for (var key in val) {
                if (val.hasOwnProperty(key)) {
                    itemComponent.set(key, val[key]);
                }
            }

            this._onPropertyChanged(this, 'itemTemplate', val, oldVal);
        }
    }
});
},{"../../QObject":24,"../ContentContainer":3,"../UIComponent":16,"./ItemTemplate":12,"./Primitives":15,"observable-sequence":25}],11:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('HBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    addChild: function (child) {
        var div = new Primitive.div();
        div.addChild(child);
        this._children.push(div);

        var children = this.el.childNodes;
        var count = children.length;
        for (var i = 0, length = children.length; i < length; i++) {
            children[i].style.width = 100 / count + '%';
            children[i].style.float = 'left';
            children[i].style.position = 'relative';
            children[i].style.height = '100%';
        }
    }
});
},{"../UIComponent":16,"./Primitives":15}],12:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('./../UIComponent');

/**
 *
 */
module.exports = UIComponent.extend('ItemTemplate', {

}, function (cfg) {
    UIComponent.call(this, cfg);
});
},{"./../UIComponent":16}],13:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');

module.exports = ContainerComponent.extend('ListBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    }
});
},{"../UIComponent":16,"./ContainerComponent":10,"./Primitives":15}],14:[function(require,module,exports){
/**

 * Created by ravenor on 13.07.16.
 */


var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('NumberKeyboard', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
        this.el.style.width = '200px';
        this.el.style.overflow = 'hidden';
        this.el.style.margin='12px auto';

        function createButton(n) {
            var self = this;
            var el = document.createElement('input');
            el.type = 'submit';
            n == '<<' ? el.style.width = '66.66%' : el.style.width = '33.33%';
            el.style.height = '50px';
            el.value = n;
            el.style.float = 'left';
            el.style.background='#ffa834';
            el.style.color='#fff';
            el.style.border='1px solid #fff';


            el.addEventListener('mousedown', function (event) {
                var ae = UIComponent.document.activeElement;
                var val = el.value;

                if (ae.type === 'text') {

                    if (val == '<<') {
                        var oldVal = ae.value;
                        ae.value = oldVal.substr(0, oldVal.length - 1);
                    } else {
                        ae.value += val;
                    }
                    ae.dispatchEvent(new Event('change'));
                }

                event.preventDefault();
                event.stopPropagation();
            });

            el.addEventListener('change', function (event) {
                el.value = n;
                event.preventDefault();
                event.stopPropagation();
            });

            return el;
        }

        this.el.appendChild(createButton(7));
        this.el.appendChild(createButton(8));
        this.el.appendChild(createButton(9));
        this.el.appendChild(createButton(4));
        this.el.appendChild(createButton(5));
        this.el.appendChild(createButton(6));
        this.el.appendChild(createButton(1));
        this.el.appendChild(createButton(2));
        this.el.appendChild(createButton(3));
        this.el.appendChild(createButton(0));
        this.el.appendChild(createButton('<<'));

    }
});
},{"../UIComponent":16,"./Primitives":15}],15:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var exports = {};

/**
 *
 */
exports['HtmlPrimitive'] = UIComponent.extend('HtmlPrimitive', {
    _prop: {
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                if (!this.textNode) {
                    this.textNode = new exports['textNode'];
                    this._children.unshift(this.textNode);
                }
                this.textNode.set('value', val);
            },
            get: Property.defaultGetter
        }),
        default: new Property('String', {description: 'any '}, {
            set: function (name, val) {
                if (val === void 0) {
                    this.el.removeAttribute(name);
                } else {
                    this.el.setAttribute(name, val);
                }
            },
            get: Property.defaultGetter
        })
    },
    _setter: {
        
        value: function (key, val) {
            
        }
    },
    _getter: {
        default: function (key) {
            return this._data[key];
        }
    }
});

/**
 *
 */
exports['textNode'] = exports['HtmlPrimitive'].extend('textNode', {
    //leaf: true,
    createEl: function () {
        this.el = UIComponent.document.createTextNode('');
    },
    _prop: {
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                this.el.nodeValue = val;
            },
            get: Property.defaultGetter
        })
    }
});

/**
 *
 */
exports['input'] = exports['HtmlPrimitive'].extend('input', {
    //leaf: true,
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');

        this.el.addEventListener('click', function (e) {
            self.fire('click', e);
        });
        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
    },
    _prop: {
        value: new Property('String', {},{
            set: function (key, val) {
                if (val === void 0) {
                    this.el.value='';
                } else {
                    this.el.value=val;
                }
            }
        }),
        checked: new Property('Boolean')
    },
    _setter: {


        checked: function (key, val) {
            if (val === void 0) {
                this.el.removeAttribute('checked');
            } else {
                this.el.setAttribute('checked', val);
            }
            this._data['checked'] = val;
        },
        disabled: function (key, val) {
            if (val) {
                this.el.disabled=true;
            } else {
                this.el.disabled=false;
            }
            this._data['checked'] = val;
        }
    }
});

/**
 *
 */
exports['textarea'] = exports['HtmlPrimitive'].extend('textarea', {
    //leaf: true,
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('textarea');

        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
    },
    _setter: {
        value: function (key, val) {
            var oldVal=this._data['value'];

            if (val === void 0) {
                this.el.value='';
            } else {
                this.el.value=val;
            }
            this._data['value'] = val;

            this._onPropertyChanged(this, 'value', val, oldVal);
        }
    }
});

exports['a'] = exports['HtmlPrimitive'].extend('a', {
    createEl: function () {
        this.el = UIComponent.document.createElement('a');
    },
    _setter: {
        default: function (name, val) {
            if (val === void 0) {
                this.el.removeAttribute(name);
            } else {
                this.el.setAttribute(name, val);
            }
            this._data[name] = val;
        },
        value: function (key, val) {
            if (!this.textNode) {
                this.textNode = new exports['textNode'];
                this._children.unshift(this.textNode);
            }
            this.textNode.set('value', val);
        },
        href: function (name, val) {
            if (val === void 0) {
                this.el.removeAttribute('href');
            } else {
                this.el.setAttribute('href', val);
            }
            this._data['href'] = val;
        }
    },
    _getter: {
        default: function (key) {
            return this._data[key];
        },
        href: function () {
            return this._data['href'];
        }
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,th,thead,tr,u,ul,header,embed')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = UIComponent.document.createElement(name);
                //this.el.style.overflow = 'hidden';
                //this.el.style.position = 'absolute';
            }
        });
    });

module.exports = exports;
},{"../../Property":23,"../UIComponent":16}],16:[function(require,module,exports){
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
        _prop: (function(){
            var out = ('left,right,top,bottom,height,width,float,border,overflow,margin,visibility'
                .split(',')
                .reduce(function(store, key){
                    store[key] = Property.generate.cssProperty('Element`s css property '+key);
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
},{"../Property":23,"./AbstractComponent":2,"./ContentContainer":3,"observable-sequence":25,"z-lib-structure-dqIndex":28}],17:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Components/AbstractComponent");
var FiltratingPipe = require("./Pipes/FiltratingPipe");
var SimplePipe = require("./Pipes/SimplePipe");

/**
 *
 * @constructor
 */
function EventManager() {
    this._registredComponents = {};
    this._registredPipes = {};
}

EventManager.prototype = new QObject();

/**
 * Generates callback function
 *
 * @returns Function
 */
EventManager.prototype.getOnValueChangedEventListener = function () {
    var self = this;

    return function (sender, name, newValue, oldValue) {
        // TODO think about getting id through getter
        var key = sender.id + '.' + name;
        var propertyPipes = self._registredPipes[key];

        if (propertyPipes) {
            for (var i = 0; i < propertyPipes.length; i++) {
                var currentPipe = propertyPipes[i];

                var targetComponentName = currentPipe.targetComponent;

                var val;
                if (key == sender.id + '.' + currentPipe.sourceBindings[key].propertyName)
                    val = newValue;
                else
                    val = sender.get(currentPipe.sourceBindings[key].propertyName);

                var targetComponent = self._registredComponents[targetComponentName];
                if (targetComponent) {
                    currentPipe.process(key, val, targetComponent);
                }
            }
        }
    }
};

/**
 *
 * @param component AbstractComponent
 */
EventManager.prototype.registerComponent = function (component) {
    this._registredComponents[component.id] = component;
    component.subscribe(this.getOnValueChangedEventListener());
};

/**
 *
 * @param source
 * @param target
 */
EventManager.prototype.createSimplePipe = function (source, target) {

    var newPipe = new SimplePipe(source, target);

    this.registerPipe(newPipe);

    return newPipe;
};

/**
 *
 * @param pipe Pipe
 */
EventManager.prototype.registerPipe = function (pipe) {

    var bindingSources = pipe.sourceBindings;
    var component;

    for (var source in bindingSources) {
        if (bindingSources.hasOwnProperty(source)) {

            var currentSource = bindingSources[source];

            component = this._registredComponents[currentSource.componentName];
            currentSource.value = component ? component.get(currentSource.propertyName) : void(0);

            var pipes = this._registredPipes[currentSource.key];
            pipes ? pipes.push(pipe) : this._registredPipes[currentSource.key] = [pipe];


        }
    }

    component = this._registredComponents[pipe.targetComponent];
    if (component)
        pipe.process(null, null, component);
};


module.exports = EventManager;
},{"./Components/AbstractComponent":2,"./Pipes/FiltratingPipe":20,"./Pipes/SimplePipe":22,"./QObject":24}],18:[function(require,module,exports){
/**
 * Created by ravenor on 12.07.16.
 */

/**
 * Fake constructor ^_^
 * created for pretty syntax
 *
 * @constructor
 */
function MulticastDelegate() {
    var delegate = MulticastDelegate.createDelegate();

    for (var i = 0, _l = arguments.length; i < _l; i++)
        delegate.addFunction(arguments[i]);

    return delegate;
}

/**
 *  Kinda static method
 *
 *  We put function un your function, so you can call function while you calling function
 *
 * @returns Function
 */
MulticastDelegate.createDelegate = function () {
    var delegate =
            function () {
                for (var i = 0, _i = flist.length; i < _i; i++) {
                    flist[i].apply(this, arguments);
                }
            },
        flist = delegate.flist = [];

    delegate.addFunction = function (fn) {
        flist.push(fn);
    };

    return delegate;
};

module.exports = MulticastDelegate;
},{}],19:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("./../Components/AbstractComponent");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 * @abstract
 */
function AbstractPipe(source, target) {
    this.sourceBindings = {};

    if (Array.isArray(source)) {
        for (var i = 0; i < source.length; i++) {
            var currentSource = source[i];
            this._addInputSource(currentSource);
        }
    } else {
        this._addInputSource(source)
    }

    this.targetComponent = target.component;
    this.targetPropertyName = target.property;
}

AbstractPipe.prototype = Object.create(QObject.prototype);

AbstractPipe.create = function () {

};

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._parseInput = function (input) {

    var newSourceBinding = {};

    if (typeof input === 'string' || input instanceof String) {
        var firstDotIndex = input.indexOf('.');
        if (firstDotIndex < 0)return;

        newSourceBinding.key = source;
        newSourceBinding.componentName = source.substr(0, firstDotIndex);
        newSourceBinding.propertyName = source.substr(firstDotIndex + 1);

    } else {
        newSourceBinding.key = source.component + '.' + source.property;
        newSourceBinding.componentName = source.component;
        newSourceBinding.propertyName = source.property;
    }

    this.sourceBindings[newSourceBinding.key] = newSourceBinding;
};

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._addInputSource = function (source) {
    var newSourceBinding = {};

    if (!(typeof source === 'string' || source instanceof String)) {
        source = source.component + '.' + source.property;
    }

    var propParts = source.split('.');

    if (propParts.length < 2) return;

    newSourceBinding.key = propParts.slice(0, 2).join('.');// source;
    newSourceBinding.componentName = propParts[0];
    newSourceBinding.propertyName = propParts.slice(1, propParts.length).join('.');

    this.sourceBindings[newSourceBinding.key] = newSourceBinding;
};

/**
 * Executing on data change
 *
 * @param key
 * @param value
 * @param component
 */
AbstractPipe.prototype.process = function (key, value, component) {

    var sourceBinding = this.sourceBindings[key];

    var changed = false;

    if (sourceBinding) {
        changed = this.sourceBindings[key].value !== value;
        this.sourceBindings[key].value = value;
    }

    //if (changed)
        this._process(key, component);
};

/**
 *
 * @param changedKey
 * @param component
 * @private
 */
AbstractPipe.prototype._process = function (changedKey, component) {

    if (changedKey)
        component.set(this.targetPropertyName, this.sourceBindings[changedKey].value);
};

module.exports = AbstractPipe;
},{"./../Components/AbstractComponent":2,"./../QObject":24}],20:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("./../Components/AbstractComponent");
var AbstractPipe = require("./AbstractPipe");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 * @abstract
 */
function FiltratingPipe(source, target) {
    AbstractPipe.call(this, source, target);

    /**
     *
     * @type {Array}
     * @private
     */
    this._filters = [];
}

FiltratingPipe.prototype = Object.create(AbstractPipe.prototype);

/**
 *
 * @param filterFunction Function
 */
FiltratingPipe.prototype.addFilter = function (filterFunction) {
    this._filters.push(filterFunction)
};

/**
 *
 * @param changedKey
 * @param component
 * @private
 */
FiltratingPipe.prototype._process = function (changedKey, component) {
    var filters = this._filters;
    var length = filters.length;
    var result = true;


    if (!changedKey) return;
    var value = this.sourceBindings[changedKey].value;


    for (var i = 0; i < length; i++) {
        if (!filters[i](value)) {
            result = false;
            break;
        }
    }

    if (result)
        component.set(this.targetPropertyName, value);
};

module.exports = FiltratingPipe;
},{"./../Components/AbstractComponent":2,"./../QObject":24,"./AbstractPipe":19}],21:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("../Components/AbstractComponent");
var AbstractPipe = require("./AbstractPipe");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 * @abstract
 */
function MutatingPipe(source, target) {
    AbstractPipe.call(this, source, target);

    /**
     *
     * @type {Array}
     * @private
     */
    this._mutators = [];
}

MutatingPipe.prototype = Object.create(AbstractPipe.prototype);

/**
 *
 * @param mutatorFunction
 */
MutatingPipe.prototype.addMutator = function (mutatorFunction) {
    this._mutators.push(mutatorFunction)
};

/**
 *
 * @param changedKey
 * @param component
 * @private
 */
MutatingPipe.prototype._process = function (changedKey, component) {
    var mutators = this._mutators;
    var length = mutators.length;
    var args = [];

    for (var source in this.sourceBindings) {
        if (this.sourceBindings.hasOwnProperty(source)) {
            args.push(this.sourceBindings[source].value);
        }
    }

    var value = mutators[0].apply(this, args);

    for (var i = 1; i < length; i++) {
        value = mutators[i](value);
    }

    if (value != void(0))
        component.set(this.targetPropertyName, value);
};

module.exports = MutatingPipe;
},{"../Components/AbstractComponent":2,"./../QObject":24,"./AbstractPipe":19}],22:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("./../Components/AbstractComponent");
var AbstractPipe = require("./AbstractPipe");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 * @abstract
 */
function SimplePipe(source, target) {
    AbstractPipe.call(this, source, target);
}

SimplePipe.prototype = Object.create(AbstractPipe.prototype);
SimplePipe.prototype.constructor = AbstractPipe;

module.exports = SimplePipe;
},{"./../Components/AbstractComponent":2,"./../QObject":24,"./AbstractPipe":19}],23:[function(require,module,exports){
/**
 * Created by zibx on 01.08.16.
 */
module.exports = (function () {
    'use strict';
    /**
     * Factory of factories of properties
     */

    var dataTypes = {
        Boolean: {
            set: function(){

            },
            get: function(key, value){
                return value;
            },
            validate: function (value) {
                if(value !== !!value)
                    return false;
                else
                    return true;
            }
        },
        Variant: {
            set: function(value){

            },
            get: function(key, value){
                return value;
            }
        }
    };
    //class Boolean extends Type
    var setter = function (value) {
        var key = this.key,
            oldValue = this.parent._data[key],
            validate = this.validate;

        if((!validate || (validate && validate(value))) && value !== oldValue) {
            if(this._set.call(this.parent, key, value, oldValue) !== false) {
                this.parent._data[key] = value;
                this.parent._onPropertyChanged(this.parent, key, value, oldValue);
            }
        }else
            return false;
    };
    var getter = function () {
        return this._get.call(this.parent, this.key, this.parent._data[this.key]);
    };

    var Property = function(type, metadata, cfg, defaultValue){
        metadata = metadata || {};
        cfg = cfg || {};

        var dataType = dataTypes[type] || dataTypes.Variant,
            proto = {parent: null};
        proto.type = metadata.type = type;
        proto.value = metadata.defaultValue = defaultValue;

        var cls = function(parent, key, value){
            this.parent = parent;
            this.key = key;

            if(arguments.length>2){
                this.set(value) !== false || this.set(this.value);
            }
        };
        cls.prototype = proto;
        proto.metadata = metadata;
        if(!('set' in cfg) && !('get' in cfg)){
            proto._set = dataType.set;
            proto._get = dataType.get;
        }else{
            proto._set = cfg.set;
            proto._get = cfg.get;
        }
        if(('validate' in cfg) || (!('validate' in cfg) && ('validate' in dataType)) ){
            proto.validate = cfg.validate || dataType.validate;
        }

        proto.set = setter;
        proto.get = getter;
        return cls;
    };

    Property.generate = {cssProperty: function (text) {
        return new Property('String',
            {description: text},
            {
                set: function (key, val) {
                    if (val) {
                        this.el.style[key] = val;
                    } else {
                        this.el.style.removeProperty(key);
                    }
                },
                get: function (key, value) {
                    return value;
                }
            }
        );
    },
        attributeProperty: function (text) {
        return new Property('String',
            {description: text},
            {
                set: function (key, val) {
                    if (!val) {
                        this.el.removeAttribute(key);
                    } else {
                        this.el.setAttribute(key, val);
                    }

                    this.el[key] = val;
                },
                get: function (key, value) {
                    return value;
                }
            }
        );
    }};
    Property.defaultGetter = dataTypes.Variant.get;
    return Property;
})();
},{}],24:[function(require,module,exports){
var observable = require('z-observable');

(function () {
    'use strict';

    var components = {};

    /**
     * Top level class
     *
     * @constructor
     */
    function QObject(cfg) {
        cfg && this.apply(cfg);
        observable.prototype._init.call(this);
    }

    var prototype = {

        on: observable.prototype.on,
        fire: observable.prototype.fire,
        removableOn: observable.prototype.removableOn,
        un: observable.prototype.un,
        /**
         * Copy all properties of object2 to object1, or object1 to self if object2 not set
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        apply: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                target[i] = source[i];
            return target;
        },

        /**
         * Copy all properties of one object to another
         * Does not copy existed properties
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        applyIfNot: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                target[i] === void 0 && ( target[i] = source[i] );

            return target;
        },

        /**
         * Copy all properties of one object to another and make them not enumerable and not overwritable
         *
         * @param object1
         * @param object2
         * @returns {*} Changed object
         */
        applyPrivate: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                Object.defineProperty(target, i, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: source[i]
                });
            return target;
        },

        /**
         * Convert Array to hash Object
         *
         * @param arr Array: Array to convert
         * @param [val=true] Any: value that would be setted to each member
         * @returns {{hash}}
         */
        arrayToObject: function (arr, val) {
            var i = 0, _i = arr.length,
                newVal = val || true,
                out = {};
            if (arr === null || arr === void 0) return out;

            for (; i < _i; i++) {
                out[arr[i]] = newVal;
            }
            return out;
        },

        extend: function (name, cfg, init) {
            var i,
                overlays, proto,

                /** what is extending */
                original = components[this._type];


            /** constructor of new component */
            var Cmp = init || function (cfg) {
                    original.call(this, cfg);
                };

            /** remove deep applied */
            overlays = deepApply.reduce(function (storage, deepName) {
                if (deepName in cfg) {
                    storage[deepName] = cfg[deepName];
                    delete cfg[deepName];
                }
                return storage;
            }, {});

            proto = Cmp.prototype = Object.create(original.prototype).apply(cfg);

            for (i in overlays) {
                proto[i] = QObject.apply(Object.create(proto[i]), overlays[i]);
            }

            Cmp._type = Cmp.prototype._type = name;
            Cmp.extend = QObject.extend;
            Cmp.document = QObject.document;

            /** register to components */
            components[name] = Cmp;

            return Cmp;
        }
    };

    // makes prototype properties not enumerable
    QObject.prototype = prototype.applyPrivate.call({}, prototype);
    prototype.apply(QObject, prototype);

    var deepApply = [/*'_setter', '_getter', */'_prop'],
        deepApplyHash = QObject.arrayToObject(deepApply);
    QObject._knownComponents = components;

    QObject.prototype._type = "QObject";
    QObject._knownComponents['QObject'] = QObject;
    if (typeof document === 'undefined') {
        //QObject.document = require("dom-lite").document;
    } else {
        QObject.document = document;
    }

    module.exports = QObject;
})();
},{"z-observable":30}],25:[function(require,module,exports){
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// Copyright by Ivan Kubota. 2015
module.exports = (function () {
    'use strict';
    var Iterator = function( obj, start ){
        this.obj = obj;
        this.pointer = start === void 0 ? -1 : start;
    };
    Iterator.prototype = {
        get: function(){
            return this.obj.get(this.pointer);
        },
        home: function(){
            this.pointer = -1;
        },
        end: function(){
            this.pointer = this.obj.length;
        },
        next: function(){
            this.pointer++;
            return this.get();
        },
        prev: function(){
            this.pointer--;
            return this.get();
        },
        last: function(){
            return this.pointer === this.obj.length - 1;
        },
        remove: function(){
            this.obj.splice(this.pointer, 1);
        }
    };
    var getter = function( i ){
        return this[i];
    };
    var fns = Array.prototype;
    /*
    @arg arr<ArrayInterface>: arr object must support push, pop, shift, unshift and splice operations. arr may support indexOf
     */
    var ObservableArray = function (arr){
        this.listeners = {};
        this._arr = arr;//[];
        if( !('get' in arr) ){
            Object.defineProperties( arr, {
                get: { value: getter, enumerable: false }
            } );
        }
        this.length = this._arr.length;
    };
    ObservableArray.prototype = {
        length: 0,
        indexOf: function (a) {
            return this._arr.indexOf(a);
        },
        toArray: function () {
            return this._arr;
        },
        _fireAdd: function (item, pos) {
            var arr = this._arr;
            this.fire('add', item, pos > 0 ? arr.get(pos-1) : null, pos < this.length - 1 ? arr.get(pos+1) : null, pos)
        },
        _fireRemove: function (item, pos) {
            var arr = this._arr;
            this.fire('remove', item, pos > 0 ? arr.get(pos-1) : null, pos < this.length ? arr.get(pos) : null, pos)
        },
        push: function (item) {
            // single item push only
            var out = this._arr.push(item);
            this._fireAdd(item, this.length++);
            return out;
        },
        unshift: function (item) {
            // single item unshift only
            var out = this._arr.unshift(item);
            this.length++;
            this._fireAdd(item, 0);
            return out;
        },
        shift: function(){
            var pos = --this.length,
                arr = this._arr,
                item = arr.shift();

            this._fireRemove(item, 0);
            return item;
        },
        pop: function () {
            var pos = --this.length,
                arr = this._arr,
                item = arr.pop();

            this._fireRemove(item, pos);
            return item;
        },
        fire: function (evt) {
            var listeners = this.listeners[evt], i, _i, args;
            if(!listeners)
                return;

            args = fns.slice.call(arguments,1);
            for( i = 0, _i = listeners.length; i < _i; i++ )
                listeners[i].apply( this, args );
        },
        on: function (evt, fn) {
            var tmp = this.listeners;
            (tmp[evt] = tmp[evt] || []).push(fn);
        },
        splice: function(start, count){
            var i, _i, newItems = fns.slice.call(arguments,2 ), out = [];
            for(i = 0;i<count; i++)
                out.push(this.remove(start));

            for(i = 0, _i = newItems.length; i < _i; i++)
                this.insert(newItems[i], i + start);

            return out;
        },
        /*
        set - updates element
        @arg pos: position of element. defined on [0..length]
        @arg item: element to set

        @return element that was in that position before
         */
        set: function(pos, item){
            if(pos === this.length){
                this.push( item );
                return void 0; // for same behavior we return empty array
            }
            return this.splice(pos, 1, item)[0];
        },
        iterator: function(start){
            return new Iterator(this, start);
        },
        get: function (pos) {
            return this._arr.get(pos);
        },
        remove: function(pos){
            var item = this._arr.splice(pos,1)[0];
            this.length--;
            this._fireRemove(item, pos);
            return item;
        },
        insert: function(item, pos){
            this._arr.splice(pos, 0, item);
            this.length++;
            this._fireAdd(item, pos)
        },
        forEach: function (fn) {
            return this._arr.forEach(fn);
        }
    };
    return ObservableArray;
})();
},{}],26:[function(require,module,exports){
module.exports = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b};

},{}],27:[function(require,module,exports){
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 2/22/2016
module.exports = (function () {
    'use strict';

    var slice = Array.prototype.slice;
    var Item = function (item) {
        this.data = item;
    };
    Item.prototype = {
        next: null,
        prev: null
    };
    var dequeue = function () {

    };

    var Cursor = function (item, pos) {
        this.item = item;
        this.pos = pos;
    };
    Cursor.prototype = {
        item: null,
        pos: null
    };

    dequeue.prototype = {
        lastUsedItem: null,
        first: null,
        last: null,
        cursor: null,
        Item: Item,
        length: 0,
        push: function (item) {
            this.lastUsed = item = new this.Item(item);
            if (this.first === null) {
                this.first = item;
            }
            if (this.last !== null) {
                this.last.next = item;
                item.prev = this.last;
            }
            this.last = item;
            return ++this.length;
        },
        unshift: function (item) {
            this.lastUsed = item = new this.Item(item);
            if (this.first !== null) {
                this.first.prev = item;
                item.next = this.first;
            }
            if (this.last === null) {
                this.last = item;
            }
            this.first = item;
            this.cursor && this.cursor.pos++;
            return ++this.length;
        },
        pop: function () {
            var last;
            if (last = this.last) {
                this.length--;
                if (this.last.prev) {
                    this.last.prev.next = null;
                    this.last = this.last.prev;
                } else {
                    this.last = null;
                    this.first = null;
                    this.cursor = null;
                }
                this.lastUsed = last;
                return last.data;
            }
            this.lastUsed = null;
            return void 0;

        },
        shift: function () {
            var first;
            if (first = this.first) {
                this.length--;
                if (this.first.next) {
                    this.first.next.prev = null;
                    this.first = this.first.next;
                } else {
                    this.last = null;
                    this.first = null;
                }
                this.cursor && this.cursor.pos--;
                this.lastUsed = first;
                return first.data;
            }
            this.lastUsed = null;
            return void 0;
        },
        get: function (index) {
            var pointer, min = this.length, tmp, i;
            if (index < 0 || index >= min) {
                this.lastUsed = null;
                return;
            }
            if ((tmp = Math.abs(0 - index)) < min) {
                min = tmp;
                pointer = this.first;
                i = 0;
            }
            if ((tmp = Math.abs(this.length - index - 1)) < min) {
                min = -tmp;
                pointer = this.last;
                i = this.length - 1;
            }
            if (this.cursor && this.cursor.item && (Math.abs(tmp = index - this.cursor.pos)) < min) {
                min = tmp;
                pointer = this.cursor.item;
                i = 0;
            }
            //console.log(min)
            if (min > 0) {
                while (min-- > 0)
                    pointer = pointer.next;
            } else if (min < 0) {
                while (min++ < 0)
                    pointer = pointer.prev;
            }
            this.cursor = new Cursor(pointer, index);
            this.lastUsed = pointer;
            return pointer.data;
            //console.log(pointer.data)
        },

        splice: function (pos, count) {
            if (pos < 0) pos = this.length + pos;
            count = Math.min(count, this.length - pos);
            var items,
                subSeq = new dequeue(), i, _i, pointer, last,
                sub;

            if (arguments.length > 2) {
                items = slice.call(arguments, 2);

                _i = items.length;
                for (i = 0; i < _i; i++) {
                    subSeq.push(items[i]);
                }
                sub = {first: subSeq.first, last: subSeq.last, length: _i}

            }
            this.get(pos);// move cursor
            pointer = this.cursor.item;

            subSeq.length = count;
            subSeq.first = pointer;
            last = pointer;
            for (i = 1; i < count; i++) {
                last = last.next;
            }
            subSeq.last = last;
            this.length -= count;

            if (sub) { // if insert
                this.length += sub.length;

                if (pointer.prev) {
                    pointer.prev.next = sub.first;
                    sub.first.prev = pointer.prev;
                } else
                    this.first = sub.first;

                if (last.next) {
                    last.prev = sub.last;
                    sub.last.next = last;
                } else
                    this.last = sub.last;

                //pointer.next = subSeq.first;
                //subSeq.first.prev = pointer;

            } else {
                if (pointer.prev)
                    pointer.prev.next = last.next;
                else
                    this.first = last.next;

                if (last.next)
                    last.next.prev = pointer.prev;
                else
                    this.last = last
            }
            //console.log(last, pointer.data, subSeq.toArray())
            //console.log(last, pointer.data, subSeq.toArray())
            this.cursor = null; // TODO logic to remove this dirty hack
            this.lastUsed = subSeq;
            return subSeq.toArray();
        },

        slice: function () {

        },

        indexOf: function (item) {
            var first = this.first, i = 0;
            if (!first)
                return -1;

            while (first)
                if (first.data === item)
                    return i;
                else {
                    i++;
                    first = first.next;
                }
            return -1;
        },
        toArray: function () {
            var out = new Array(this.length),
                cursor = this.first,
                i = 0, _i = this.length;
            for (; i < _i; i) {
                out[i++] = cursor.data;
                cursor = cursor.next;
            }
            return out;
        },
        map: function (fn) {
            var item = this.first,
                out = [], i = 0;
            while(item){
                out.push(fn.call(item.data,item.data, i++));
                item = item.next;
            }
            return out;
        },
        filter: function (fn) {
            var item = this.first,
                out = [], i = 0, res;
            while(item){
                res = fn.call(item.data, item.data, i++);
                res && out.push(item.data);
                item = item.next;
            }
            return out;
        },
        reduce: function (fn, first) {
            var item = this.first, i = 0, lastVal;
            if(!item)
                return;

            if(first)
                lastVal = first;
            else {
                lastVal = item.data;
                item = item.next;
            }

            while(item){
                lastVal = fn.call(item.data, lastVal, item.data, i++);
                item = item.next;
            }
            return lastVal;
        },
        each: function (fn) {
            var item = this.first, i = 0;
            while(item){
                fn.call(item.data,item.data, i++);
                item = item.next;
            }
        }
    };
    dequeue.prototype.forEach = dequeue.prototype.each;
    return dequeue;
})();
},{}],28:[function(require,module,exports){
/**
 * Created by zibx on 01.06.16.
 */
/*
Itteratable linked list with fast item search

Complexity:
 FindByIndex: ~1 (js hashtable realization)
 GetByPosition: best - 1, worst - N/2
 DeleteByIndex: ~1 (js hashtable realization)

Memory:
 Linked list with next\prev in each node
 Object that maps keys to items

 */
module.exports = (function () {


    'use strict';
    var dq = require('z-lib-structure-dequeue');

    var Index = function (id) {
        this.key = id || 'id';
        this.index = {};
        this.dequeue = new dq();
    };
    Index.prototype = {
        key: 'id',
        length: 0,
        _addIndex: function (item, el) {
            this.index[item[this.key]] = el;
        },
        _clearIndex: function (id) {
            delete this.index[id];
        },
        push: function (item) {
            var res = this.dequeue.push(item);
            this._addIndex(item, this.dequeue.lastUsed);
            this.length = this.dequeue.length;
            return res;
        },
        unshift: function (item) {
            var res = this.dequeue.unshift(item);
            this._addIndex(item, this.dequeue.lastUsed);
            this.length = this.dequeue.length;
            return res;
        },
        pop: function () {
            var res = this.dequeue.pop();
            res && this._clearIndex(res[this.key]);
            this.length = this.dequeue.length;
            return res;
        },
        shift: function () {
            var res = this.dequeue.shift();
            res && this._clearIndex(res[this.key]);
            this.length = this.dequeue.length;
            return res;
        },
        remove: function (id) {
            var pointer = this.index[id],
                next;

            if(!pointer)
                return false;

            next = pointer.next;

            this.dequeue.length--;
            this.length = this.dequeue.length;
            if (pointer.prev)
                pointer.prev.next = next;
            else {
                this.dequeue.first = next;
            }

            if (next)
                next.prev = pointer.prev;
            else {
                this.dequeue.last = pointer.prev;
            }

            this._clearIndex(id);
            return pointer.data;
        },
        getById: function (id) {
            return this.index[id].data;
        },
        splice: function (pos, count) {
            var dq = this.dequeue,
                args = slice.call(arguments, 0),
                res, out;
            out = dq.splice.apply(dq, args);
            res = this.dequeue.lastUsed;
            this.length = this.dequeue.length;
            return out;
        },
        slice: function () {

        },
        set: function (id, item) {

        },
        indexOf: function (item) {
            return this.dequeue.indexOf(item);
        },
        toArray: function () {
            return this.dequeue.toArray();
        },
        get: function (index) {
            return this.dequeue.get(index)
        },
        map: function (fn) {
            return this.dequeue.map(fn);
        },
        each: function (fn) {
            return this.dequeue.each(fn);
        },
        filter: function (fn) {
            return this.dequeue.filter(fn);
        },
        reduce: function (a,b,c) {
            return this.dequeue.reduce(a,b,c);
        }
    };

    Index.prototype.forEach = Index.prototype.each;
    return Index;
})();
},{"z-lib-structure-dequeue":27}],29:[function(require,module,exports){
/**
 * Created by Zibx on 10/14/2014.
 */(function(  ){
    'use strict';

        var applyDeep,
        toString = Object.prototype.toString,
        getType = function( obj ){
            return toString.call( obj );
        },
        slice = Array.prototype.slice,
        concat = Array.prototype.concat,
        parseFloat = this.parseFloat,

        _delayList = [],
        _delay,
        _delayFn = function(  ){
            _delay = false;
            var i, _i, data;
            for( i = 0, _i = _delayList.length; i < _i; i++ ){
                data = _delayList[i];
                delete data.fn.__delayed;
                delete data.scope.__delayed;
                data.fn.apply( data.scope, data.args || [] );
            }
        },
        bind = Function.prototype.bind;

    this.Math.sgn = function( num ){
        return num >= 0 ? 1 : -1;
    };

    var Z = {
        _cls: {},
        is: function( obj, name ){
            return obj._is && !!obj._is[name];
        },
        define: function( name, cfg, fn ){
            var waiter = Z.classWaiter || (Z.classWaiter = Z.wait());
            waiter.add();


            var Ctor = function(cfg){
                    var i = 0,
                        ctors = this._ctors,
                        _i = ctors.length,
                        fns = this._is,
                        fn;
                    Z.apply(this, cfg);
                    for( ;i<_i;i++ )
                        (fn = fns[ctors[i]]) &&
                            (fn = fn.ctor) &&
                                fn.call(this, cfg);
                },
                proto = Ctor.prototype = cfg,
                _is = proto._is = {},
                _ctors = proto._ctors = [],
                implement = cfg.implement || [];
            proto._is[name] = proto;
            proto.className = name;

            waiter.act(implement, function(){
                implement.forEach( function( name ){
                    var implementProto = Z._cls[name].prototype,
                        implement_ctors = implementProto._ctors,
                        i, _i, item;
                    Z.applyBut(proto, implementProto, ['_is', 'className', 'ctor','_ctors']);

                    for( i = 0, _i = implement_ctors.length; i < _i; i++ )
                        !_is[ item = implement_ctors[ i ] ] && _ctors.push(item);



                    Z.apply(_is, implementProto._is);
                });
                cfg.ctor && _ctors.push( name );
                proto._ctors = _ctors = concat.apply([], _ctors);
                Z._cls[name] = Ctor;
                waiter.done(1, name);

            });
            fn && Z.use(name, fn);
            return Ctor;
        },
        use: function( name, fn ){
            var waiter = Z.classWaiter || (Z.classWaiter = Z.wait());
            name = Z.makeArray(name);
            waiter.act( name, function(  ){
                fn.apply( null, name.map( function( name ){
                    return Z._cls[name];
                } ) )
            } );
        },
        extend: function( obj1, obj2 ){
            if( typeof obj1 === 'function' )
                return Z.apply( new obj1, obj2 );

            var f = function(){};
            f.prototype = obj1;
            return Z.apply( new f(), obj2 );
        },
        bind: function( scope, fn ){
            var subFn = scope[ fn ];
            return bind.apply( subFn, [].concat.apply( [scope],Z.toArray( arguments ).slice(2) ) );
            //return subFn.bind.apply( subFn, [].concat.apply( [scope],Z.toArray( arguments ).slice(2) ) );
        },
        /* take array of values. find exact match el of el that value is before searched one. It's binary search*/
        findBefore: function( arr, el ){
            return arr[ Z.findIndexBefore( arr, el ) ];
        },

        // binary search
        findIndexBefore: function( arr, el ){
            var l1 = 0,
                delta = arr.length,
                floor = Math.floor,
                place;
            while( delta > 1 ){
                delta = delta / 2;
                if( arr[floor(l1 + delta)] > el ){
                }else{
                    l1 += delta
                }
            }
            place = floor(l1+delta)-1;
            return place;
        },
        interval: function( from, to, step ){
            var out = [];
            step = Math.abs( step ) || 1;
            if( to < from )
                for( ;from >= to; from -= step )
                    out.push( from );
            else
                for( ;from <= to; from += step )
                    out.push( from );
            return out;
        },
        repeat: function( n, fn, scope ){
            var out = [];
            for( var i = 0; i < n; i++ )
                out.push( fn.call( scope, i, n ) );
            return out;
        },
        parseFloat: function(a){
            return parseFloat(a) || undefined;
        },
        getProperty: function( prop ){
            return function(a){
                return a[ prop ];
            }
        },
        getArgument: function( n ){
            return function(){
                return arguments[ n ];
            }
        },
        or: function(prop){
            return function(a){
                return a || prop;
            }
        },
        getPropertyThroughGet: function( prop ){
            return function(a){
                return a.get( prop );
            }
        },
        sort: {
            number: function( a, b ){
                return a - b;
            },
            numberReverse: function( a, b ){
                return b - a;
            },
            numberByProperty: function( name ){
                return function( a, b ){
                    return a[ name ] - b[ name ];
                }
            },
            stringByProperty: function( name ){
                return function( a, b ){
                    var aKey = a[ name ], bKey = b[ name ];
                    return aKey > bKey ? 1 : aKey < bKey ? -1 : 0;
                }
            }
        },
        checkthisPropertyExist: function (name) {
            return this.checkPropertyExist(name, this);
        },
        checkPropertyExist: function (name, obj) {
            var arr = name.split('.');

            for (var i = 0, l = arr.length; i < l; i++) {
                if (!obj[arr[i]])
                    return false;
                obj = obj[arr[i]];
            }

            return obj;
        },
        mapFn: {
            toUpperCase: function(a){
                return (a || '').toUpperCase();
            }
        },
        reduceFn: {
            min: function( a, b ){
                return a != null ? ( b != null  ? Math.min( a, b ) : a ) : b;
            },
            max: function( a, b ){
                return a != null ? ( b != null ? Math.max( a, b ) : a ) : b;
            },
            sum: function( a, b ){
                return a - (-b);
            },
            diff: function( a, b ){
                return b - a;
            },
            push: function( a ){
                this.push( a );
            },
            concat: function( a, b ){
                return a.concat( b );
            }
        },
        filter: (function(){
            var filterFn = function(fn, out){
                return function(){
                    var data = fn.apply(this, Z.toArray(arguments));
                    if( data !== void 0 )
                        out.push( data );
                }
            };
            return function( arr, fn ){
                var out = [];
                Z.each( arr, filterFn(fn, out) );
                return out;
            }
        })(),
        objectDiff: function (old, newOne, emptyValue, similarValues, deep) {
            var getType = Z.getType,

                hash = {},
                diff = {},
                i, j,
                val1, val2,
                type1, type2,
                differences = false;

            similarValues = Z.arrayToObj(similarValues || []);


            deep = deep === void 0 ? true : deep;

            for( i in old )
                old.hasOwnProperty( i ) &&
                    ( hash[ i ] = old[i] );

            for( i in newOne )
                newOne.hasOwnProperty( i ) &&
                    ( hash[ i ] === void 0 && newOne[ i ] !== void 0 ) &&
                    ( differences = true ) &&
                ( diff[i] = newOne[ i ] );

            for( i in hash )
                if( hash.hasOwnProperty( i ) ){
                    if( ( val1 = hash[i] ) === ( val2 = newOne[i] ) )
                        continue;

                    if( ( similarValues[ val1 ] === true ) === similarValues[ val2 ] )
                        continue;

                    if( val2 === void 0 ){
                        ( differences = true ) && (diff[i] = emptyValue );
                        continue;
                    }

                    if( ( type1 = getType(val1) ) !== ( type2 = getType(val2) ) ){
                        ( differences = true ) && ( diff[i] = val2 );
                        continue;
                    }

                    // here elements have the same type
                    if( type1 === '[object Array]' ){
                        if( (j = val1.length ) !== val2.length ){
                            ( differences = true ) && ( diff[i] = val2 );
                            continue
                        }

                        for( ;j; ){
                            --j;
                            if( val1[ j ] !== val2[ j ] ){
                                ( differences = true ) && ( diff[i] = val2 );
                                continue;
                            }
                        }
                    }else if( type1 === '[object Object]' ){
                        if (deep === true)
                            if (Z.objectDiff(val1, val2, emptyValue, similarValues, deep) !== false)
                                ( differences = true ) && ( diff[i] = val2 );
                    }else{
                        ( differences = true ) && ( diff[i] = val2 );
                    }


                }

            return differences ? diff : false;
        },
        pipe: function(){
            var args = Z.toArray(arguments);
            return function(){
                var out = Z.toArray(arguments);
                for( var i = 0, _i = args.length; i < _i; i++)
                    out = [args[i].apply( this, out )];
                return out[0];
            }
        },
        /*
         Function: doAfter

         Takes lots of functions and executes them with a callback function in parameter. After all callbacks were called it executes last function

         */
        doAfter: function(){
            var i = 0,
                _i = arguments.length - 1,
                counter = _i,
                callback = arguments[ _i ],
                data = {};

            for( ; i < _i; i++ ){
                (function( callFn, i ){
                    var fn = function(){
                        data[ i ] = arguments;

                        if( fn.store != null )
                            data[ fn.store ] = arguments;

                        if( !--counter )
                            callback( data );

                    };

                    callFn( fn )
                })( arguments[i], i );
            }
        },
        zipObject: function( arr1, arr2 ){
            var out = {};
            arr1.forEach(function( el, i ){
                out[el] = arr2[i];
            } );
            return out;
        },
        emptyFn: function(){},
        /*
         proxy config
         {
         fromKey: toKey        = rename
         fromKey: !toValue     = delete property if toKey === value
         !fromKey: toValue     = add value to fromKey if it's not exists
         }
         */
        proxy: function( proxy, obj ){
            var newObj = Z.clone( obj );
            Z.each( proxy, function( key, val ){

                if( val && val.charAt(0) == '!' ){
                    if( obj[ key ] == val.substr( 1 ) )
                        delete newObj[ key ];
                }else if( key.charAt(0) == '!' && newObj[ key.substr( 1 ) ] === undefined ){
                    newObj[ key.substr( 1 ) ] = val;
                }else{
                    if( obj[ key ] && val )
                        newObj[ val ] = obj[ key ];
                    delete newObj[ key ];
                }
            });
            return newObj;
        },
        clone: function( obj, deep ){
            var out, i, cloneDeep = deep != null;
            switch( getType( obj ) ){
                case '[object Array]':
                    out = [];
                    if( cloneDeep )
                        for( i = obj.length; i; ){
                            --i;
                            out[ i ] = Z.clone( obj[ i ], true );
                        }
                    else
                        for( i = obj.length; i; ){
                            --i;
                            out[ i ] = obj[ i ];
                        }
                    return out;
                case '[object Object]':
                    out = {};
                    if( cloneDeep )
                        for( i in obj )
                            out[ i ] = Z.clone( obj[ i ], true );
                    else
                        for( i in obj )
                            out[ i ] = obj[ i ];


                    return out;
            }
            return obj;
        },
        applyIfNot: function( el1, el2 ){
            var i, undefined = void 0;

            for( i in el2 )
                el1[ i ] === undefined && ( el1[ i ] = el2[ i ] );

            return el1;
        },
        /*
         Function: apply

         Applies el2 on el1. Not recursivly

         Parameters:
         el1 - object to apply on
         el2 - applieble object

         Return:
         el1

         See also:
         <Z.applyLots> <Z.applyDeep>
         */
        apply: function( el1, el2 ){
            var i;

            for( i in el2 )
                el1[ i ] = el2[ i ];

            return el1;
        },
        applyBut: function( el1, el2, but ){
            but = Z.a2o(but);
            var i;

            for( i in el2 )
                !but[i] && (el1[ i ] = el2[ i ]);

            return el1;
        },
        /*
         Function: slice

         Array.prototype.slice usually useful to convert arguments to Array

         Parameters:
         args - Array || arguments
         start - start position
         length - count of items

         Return:
         array

         Example:
         (code)
         (function (){
         return Z.slice.call( arguments, 1 );
         })(1,2,3,4,5)
         // Output:
         //   [2,3,4,5]
         (end code)
         */
        slice: slice,

        toArray: function( obj ){
            return slice.call( obj );
        },
        /*
         Function: applyLots
         Apply more then one objects

         Parameters:
         el1 - object to apply on
         args[ 1-inf ] - applieble objects

         Return:
         el1

         See also:
         <Z.apply> <Z.applyDeep>
         */
        applyLots: function( el1 ){
            var i, j, el2, applyL = arguments.length;
            for( j = 1; j < applyL; j++ ){
                el2 = arguments[ j ];
                for( i in el2 )
                    el1[ i ] = el2[ i ];
            }
            return el1;
        },

        /*
         Function: applyDeep
         Recursivly aplly el2 on el1. Work propper only with objects. Was designed to apply plugins.

         Parameters:
         el1 - object to apply on
         el2 - applieble object

         Return:
         el1

         See also:
         <Z.apply> <Z.applyLots>
         */
        applyDeep: function(a,b){
            var me = applyDeep,
                i, el;

            for( i in b ){
                el = a[ i ];
                if( el && typeof el === 'object' ){
                    me( el,  b[ i ] );
                }else
                    a[ i ] = b[ i ];
            }
            return a;
        },

        /*
         Function: isArray
         Test is argument an Array

         Parameters:
         obj - object

         Return:
         bool - true if array, false if not

         */
        isArray: function( obj ){
            return getType( obj ) === '[object Array]';
        },

        /*
         Function: each
         Itterate Objects && Arrays.

         Object gets:
         key  - key
         value  - value

         this  - element

         Array gets:
         value  - value
         i  - index of element in array

         this  - element


         Parameters:
         el - Object || Array
         callback - function which would be called with each item

         See also:
         <eachReverse>
         */
        each: function( el, callback ){
            var i, _i, out;

            if( el === null || el === undefined )
                return false;

            if( Z.isArray( el ) ){
                for( i = 0, _i = el.length; i < _i; i++ ){
                    out = callback.call( el[i], el[i], i );
                    if( out !== undefined )
                        return out;
                }
            }else{
                for( i in el )
                    if( el.hasOwnProperty( i ) ){
                        out = callback.call( el[i], i, el[i] );
                        if( out !== undefined )
                            return out;
                    }

            }
        },
        /*
         Function: eachReverse
         Itterate Objects && Arrays in reverse order.

         Object gets:
         key  - key
         value  - value

         this  - element

         Array gets:
         value  - value
         i  - index of element in array

         this  - element


         Parameters:
         el - Object || Array
         callback - function which would be called with each item

         See also:
         <each>
         */
        eachReverse: function( el, callback ){
            var i, _i, item;

            if( el === null || el === undefined )
                return false;

            if( Z.isArray( el ) ){
                for( i = el.length; i; ){
                    --i;
                    callback.call( el[i], el[i], i );
                }
            }else{
                _i = [];
                for( i in el ){
                    if( el.hasOwnProperty( i ) )
                        _i.push( [ i, el[i] ] )
                }
                for( i = _i.length; i; ){
                    item = _i[ --i ];
                    callback.call( item[1], item[0], item[1] );
                }

            }
        },
        /*
         Function: makeArray
         wraps single element with Array if not

         Parameters:
         el - Element

         Return:
         Array
         */
        makeArray: function( obj ){
            return obj !== void 0 ? ( this.isArray( obj ) ? obj : [ obj ] ) : [];
        },
        /*
         Function: arrayRotate
         Lets imagine an array as a looped object, where after last element goes the first one.

         Parameters:
         arr - Array
         val - offset of rotation

         Return:
         Array

         Example:
         Z.arrayRotate([1,2,3,4,5],2) => (3,4,5,1,2)
         */
        arrayRotate: function( arr, i ){
            return arr.slice(i).concat(arr.slice(0,i));
        },
        /*
         Function: arrayToObj
         Convert Array to hash Object

         Parameters:
         arr - Array
         val [optional] - value that would be setted to each member (default is _true_)

         Return:
         Hash object
         */
        arrayToObj: function( arr, val ){
            var i = 0, _i = arr.length,
                newVal = val || true,
                out = {};
            if( arr === null || arr === undefined ) return out;

            for( ; i < _i; i++ ){
                out[ arr[ i ] ] = newVal;
            }
            return out;
        },
        makeHash: function( arr, hash, hashVal ){
            var out = {}, i, item, tmp;
            if( typeof hashVal === 'function' )
                if( typeof hash === 'function' ){
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        tmp = hash( item );
                        out[ tmp ] = hashVal( item, out[tmp] );
                    }
                }else{
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        tmp = item[ hash ];
                        out[ tmp ] = hashVal( item, out[ tmp ] );
                    }
                }
            else
                if( typeof hash === 'function' ){
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        out[ hash( item ) ] = item;
                    }
                }else{
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        out[ item[ hash ] ] = item;
                    }
                }
            return out;
        },
        map: function(el, f){
            var out = [],
                toArray = Z.toArray;
            Z.each(el, function(){
                out.push( f.apply( this, toArray(arguments) ) );
            });
            return out;
        },
        isEmpty: function( obj ){
            var undefined = void 0;
            if( getType( obj ) === '[object Object]' )
                for( var i in obj ){
                    if( obj.hasOwnProperty(i) && obj[i] !== undefined )
                        return false
                }
            return true;
        },
        allArgumentsToArray: function(args){
            return Array.prototype.concat.apply([],Z.toArray(args).map( Z.makeArray.bind(Z) ));
        },
        wait: (function(  ){
            var wait = function( fn ){
                this.counter = 0;
                this.fn = [];
                this.after(fn);
                this._actions = {};
            };
            wait.prototype = {
                after: function( fn ){
                    this.fn.push(fn);
                    this.finished && this._try();
                    this._actions = {};
                    this._waiters = {};
                },
                act: function( obj, after ){
                    var actions = this._actions,
                        _self = this;
                    var W = new wait( function(  ){
                        after();
                    } );
                    Z.each( obj, function( name, fn ){

                        if( actions[ name ] === void 0 ){
                            W.add();
                            actions[ name ] = false;
                            if( fn ){
                                _self.add();
                                fn( function(){
                                    actions[name] = true;
                                    _self.done( 1, name );
                                } );
                            }
                            (_self._waiters[name] = _self._waiters[name] || []).push(W);
                        }else if( actions[ name ] === false ){
                            W.add();
                            (_self._waiters[name] = _self._waiters[name] || []).push(W);
                        }
                    } );
                    W.done(0);

                },
                add: function( count ){
                    this.counter += count === void 0 ? 1 : count;
                },
                _try: function(  ){
                    if( this.finished || (this.counter === 0 && this.fn.length) ){

                        this.finished = true;
                        var fns = this.fn, fn, i = 0, _i = fns.length;
                        for(;i<_i; i++)
                            (fn = fns[i]) && typeof fn === 'function' && fn();
                    }
                },
                done: function( count, name ){
                    if(typeof name === 'string'){
                        this._actions[name] = true;
                        var el;
                        if(this._waiters[name])
                            while( el = this._waiters[name].pop() )
                                el.done();
                    }
                    this.counter -= count === void 0 ? 1 : count;
                    this.counter === 0 && setImmediate(this._try.bind(this));
                }
            };
            return function( fn ){
                return new wait( fn );
            };
        })()
    };
    Z.a2o = Z.arrayToObj;
    module && (module.exports = Z);
}).call(
    // get eval from its nest
    (1,eval)('this')
);

},{}],30:[function(require,module,exports){
/**
 * Created by Ivan on 10/19/2014.
 */

module.exports = (function(){
    'use strict';
    var Z = require('z-lib');

    var slice = Array.prototype.slice;
    /*
    Compile subscribers to a single function
     */
    var eventBuilder = function( el, scope ){
        var out = [scope],
            txt = [], names = [], counter = 0, fireFn;
        el.list.forEach(function( el ){
            out.push( el.fn, el.caller );
            names.push( 'f'+ counter, 'c'+ counter );
            txt.push('f'+ counter +'.apply('+ 'c'+ counter + ', (data[dataLength] = c'+ counter+') && data) === false');
            counter++;
        });
        names.push('data');
        !el.plain && txt.reverse();
        fireFn = new Function(
            names.join(','),
            'var dataLength = data.length;return (' + txt.join('||')+')? false : this;'
        );
        el.fn = fireFn.bind.apply(fireFn, out);
    };

    var proto = {
        /*
         Function: _init
         Runs in class init. Adds uniq `eventList` object to class

         */
        _init: function(){
            this.eventList = {};//this._EventList ? new this._EventList().eventList : {};
            this.on(this.listeners);
        },
        /*_initPrototype: function(  ){
            var tmp = function(){ this.eventList = {}; };
            tmp.prototype = proto;

            this._EventList = function(){};
            this._EventList.prototype = { eventList: (new tmp()).on( this.listeners ).eventList };
        },*/
        /*
         Function: fireEvent (fire)
         Fires an event



         Parameters:
         eventName - name of event
         args[ 1 .. inf ] - arguments to event callbacks

         */
        fireEvent : function fire( eventName ) {

            var data, i,
                event = this.eventList[ eventName ],
                allEvents = this.eventList[ '*' ],
                prevented,
                fn;

            allEvents && allEvents.fn.apply(allEvents, arguments);

            if( event ) {

                // copy args to data.
                data = new Array(i = arguments.length - 1);
                while(i--)
                    data[i] = arguments[i+1];

                return event.fn(data);
            }else{
                prevented = false;
                if( this.listeners && this.listeners[ eventName ] ){
                    fn = this.listeners[ eventName ];
                    var subscriber, dataLength = data.length;

                    /*debug cut*/
                    /*if( event.length > 10 ){
                     console.warn('Strange event `'+ eventName +'`, ' + event.length + ' handlers attached')
                     }*//*/debug cut*/
                    data = new Array(i = arguments.length - 1);
                    while(i--)
                        data[i] = arguments[i+1];

                    data[ dataLength ] = subscriber.caller;
                    prevented = fn.apply( this, data ) === false;
                }
            }

            return prevented ? false : this;
        },
        /* When you don't want this event to be fired too frequently.
           But it still would be fired on first call and last call would be done as well.*/
        fireSchedule: function( interval, eventName ){
            var eventList = this.eventList,
                event = eventList[ eventName ],
                date, nextCall;
            if( !event )
                return;

            nextCall = event.nextCall;

            date = (new Date()).valueOf();
            event.args = slice.call( arguments, 1 );
            if( !nextCall || nextCall <= date ){
                event.nextCall = date + interval;
                this.fire.apply( this, event.args );
            }else if( nextCall > date ){
                if( event.timeout )
                    return;
                event.timeout = setTimeout(function(){
                    event.timeout = void 0;
                    event.nextCall = date + interval;
                    this.fire.apply( this, event.args );
                }.bind(this), interval + 2 );
            }
        },

        /*
         Function: on

         Subscribe callback on event

         Parameters:
         eventName - name of event
         fn - callback function
         [ caller = this ] - scope to call on ( default: this )

         */
        on : function on( eventName, fn, caller ) {
            if( typeof eventName !== 'string' ){ // object of events
                for( var i in eventName ){
                    if( eventName.hasOwnProperty( i ) )
                        this.on( i, eventName[ i ] );
                }
            }else{
                if( eventName.indexOf(',') > -1 ){
                    Z.each( eventName.split(','), function( eventName ){
                        this.on( eventName.trim(), fn, caller );
                    }.bind(this) );
                }else{
                    var eventList = this.eventList,
                        data = {fn : fn, caller : caller || this };

                    !eventList && (eventList = {});
                    (eventList[eventName] || ( eventList[eventName] = { list: [] } )).list.push( data );
                    eventList[eventName] = { list: eventList[eventName].list.slice() };
                    if( eventList[eventName].list.length > 10 ){
                        window.console.warn('Strange event `'+ eventName +'`, ' + eventList[ eventName ].length + ' handlers attached');
                    }/*/debug cut*/
                    eventBuilder( eventList[eventName], this );
                }
            }
            return this;
        },

        once: function( name, fn, scope ){
            var wrap = function(){
                fn.apply(scope, arguments);
                this.un(name, wrap);
            };
            this.on( name, wrap, this );
        },
        removableOn: function( eventName, fn, caller ){
            var wrap = function(){
                fn.apply(caller, arguments);
            },
                _self = this;
            this.on( eventName, wrap, this );

            return {remove: function(  ){
                _self.un(eventName, wrap);
            }};

        },
        /*
         Function: un

         Unsubscribe callback for event. It's important that fn shoul be same function pointer, that was pased in <on>

         Parameters:
         eventName - name of event
         fn - callback function

         */
        un : function un( eventName, fn ){
            var event = this.eventList[ eventName ],
                i, eventList;



            if( event !== undefined )
                if( fn === undefined )
                    delete this.eventList[ eventName ];
                else{
                    for( eventList = event.list, i = eventList.length ; i ; )
                        if( eventList[ --i ].fn === fn )
                            eventList.splice( i, 1 );

                    if( !eventList.length )
                        delete this.eventList[ eventName ];
                    else
                        eventBuilder( event, this );
                }


            return this;
        },
        /*
         Function: set

         Set parameter with events
         */

        set: function( param, value ){
            var oldValue = this[ param ];
            if( this.fireEvent( param + 'BeforeSet', value, oldValue ) === false )
                return false;
            this[ param ] = value;
            this.fireEvent( param + 'Set', value, oldValue );
            return value;
        },

        _unbindListeners: function (name) {
            var listen = this[ name || 'listen' ];

            if (listen) {
                Z.each(listen, function() {
                    if (this && typeof this.remove == "function")
                        this.remove();
                    else if (typeof this === 'function')
                        this();
                });
            }
        },

        _initListeners: function () {
            this.listen = {};
        }
    };
    proto.fire = proto.fireEvent;
    Z.Observable = function(){
        this._init();
    };
    Z.Observable.prototype = proto;
    return Z.Observable;
})();
},{"z-lib":29}]},{},[1])(1)
});