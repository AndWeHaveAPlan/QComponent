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
            Checkbox: require('./Base/Components/UI/Checkbox')
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
    Pipes: {
        AbstractPipe: require("./Base/Pipes/AbstractPipe"),
        SimplePipe: require("./Base/Pipes/SimplePipe"),
        FiltratingPipe: require("./Base/Pipes/FiltratingPipe"),
        MutatingPipe: require("./Base/Pipes/MutatingPipe")
    }
};
},{"./Base/Components/AbstractComponent":2,"./Base/Components/ContentContainer":3,"./Base/Components/Factory":4,"./Base/Components/Logical/Branch":5,"./Base/Components/Logical/Gate":6,"./Base/Components/Logical/LogicalComponent":7,"./Base/Components/Logical/Timer":8,"./Base/Components/UI/Checkbox":9,"./Base/Components/UI/Primitives":10,"./Base/Components/UIComponent":11,"./Base/EventManager":12,"./Base/Pipes/AbstractPipe":14,"./Base/Pipes/FiltratingPipe":15,"./Base/Pipes/MutatingPipe":16,"./Base/Pipes/SimplePipe":17,"./Base/QObject":18}],2:[function(require,module,exports){
/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    MulticastDelegate = require('../MulticastDelegate');

/**
 * Base class for all components
 * @param cfg.parent Component: Parent component
 * @param cfg.id String: Component unique id
 * @param [cfg.leaf] Boolean: True if component may have children
 * @constructor
 */
function AbstractComponent(cfg) {

    var self = this;

    this.apply(cfg);

    if(!this.id)
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
    this._ownComponents = new ObservableSequence( new DQIndex( 'id' ) );

    if (!this.leaf){
        /** instantly modify child components on append */
        this._ownComponents.on('add', function( child ){
            child.parent = self;
        });
    }

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = new MulticastDelegate();

    if(!this._eventManager)
        this._eventManager = new EventManager();

    this._eventManager.registerComponent(this.id, this);
}

AbstractComponent.extend = QObject.extend;
AbstractComponent.prototype = new QObject({

    /** mutators */
    _setter: {
        default: function (name, value) {
            var oldValue = this._data[name];
            this._data[name] = value;
            //TODO проверки надо бы всякие
            this._onPropertyChanged(this, name, value, oldValue);
        }
    },

    /** accessors */
    _getter: {
        default: function (name) {
            return this._data[name];
        }
    },

    /**
     * Get property from component
     *
     * @param name String
     */
    get: function (name) {
        var accesor = this._getter[name] || this._getter.default;

        return accesor.call(this, name);
    },

    /**
     * Set property to component
     *
     * @param name String
     * @param value Object
     */
    set: function (name, value) {
        var mutator = this._setter[name] || this._setter.default;

        mutator.call(this, name, value);
        return this;
    },

    /**
     * Subscribe to _onPropertyChanged event
     *
     * @param callback Function
     */
    subscribe: function (callback){
        this._onPropertyChanged.addFunction( callback );
    },

    /**
     * Add Child component
     *
     * @param component AbstractComponent: AbstractComponent to add
     */
    /*addComponent: function( component ){
        this._ownComponents.push(component);
        return this;
    },*/

    _type: 'AbstractComponent'
});

AbstractComponent._type = AbstractComponent.prototype._type;

/** properties that need deep applying */


QObject._knownComponents['AbstractComponent'] = module.exports = AbstractComponent;
},{"../MulticastDelegate":13,"./../EventManager":12,"./../QObject":18,"observable-sequence":20,"tiny-uuid":22,"z-lib-structure-dqIndex":24}],3:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var AbstractComponent = require('./AbstractComponent');


/**
 *
 */
module.exports = AbstractComponent.extend('ContentContainer', {
    _setter: {
        value: function () {
        },
        default: function () {
        }
    },
    _getter: {
        value: function () {
        },
        default: function () {
        }
    }
}, function (cfg) {
    AbstractComponent.call(this, cfg);

    this.el = document.createElement('div');
});
},{"./AbstractComponent":2,"dom-lite":19}],4:[function(require,module,exports){
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

},{"../QObject":18,"./AbstractComponent":2}],5:[function(require,module,exports){
module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');

    var Branch = LogicalComponent.extend('Branch', {
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
},{"./LogicalComponent":7}],6:[function(require,module,exports){
module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');

    var Gate = LogicalComponent.extend('Branch', {

        open: true,


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
},{"./LogicalComponent":7}],7:[function(require,module,exports){


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

    var Timer = LogicalComponent.extend('Timer', {

        _intervalObj: void(0),

        _tick: function (self) {
            return function () {
                self.set('tick');
            }
        },

        _setter: {
            start: function (name, value) {
                if (value)
                    this.set('interval', value);

                if (this._intervalObj)
                    clearInterval(this._intervalObj);

                var int = this.get('interval');
                var t = this._tick(this);
                this._intervalObj = setInterval(t, int);

                this._onPropertyChanged(this, 'start', true, void(0));
            },
            stop: function (name, value) {
                if (this._intervalObj)
                    clearInterval(this._intervalObj);

                this._onPropertyChanged(this, 'stop', true, void(0));
            },
            interval: function (name, value) {
                var prev = this._data.interval;
                this._data.interval = value;
                this._onPropertyChanged(this, 'interval', this.get('interval'), void(0));
            },
            tick: function () {
                this._onPropertyChanged(this, 'tick', true, void(0));
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._data.interval = 1000;
    });

    return Timer;
})();
},{"./LogicalComponent":7}],9:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');



module.exports = UIComponent.extend('Checkbox', {
    createEl: function () {
        this.el = document.createElement('input');
        this.el.setAttribute('type', 'checkbox');
    },
    _setter: {
        checked: function (key, value) {

            var oldVal = this._data.checked;

            if (!!value) {
                this.el.setAttribute('checked', '');
            } else {
                this.el.removeAttribute('checked');
            }

            this._data.checked = !!value;
            this._onPropertyChanged(this, 'value', value, oldVal);
            this._onPropertyChanged(this, 'checked', value, oldVal);
        },
        value: function (key, value) {

            var oldVal = this._data.checked;

            if (!!value) {
                this.el.setAttribute('checked', '');
            } else {
                this.el.removeAttribute('checked');
            }

            this._data.checked = !!value;
            this._onPropertyChanged(this, 'checked', value, oldVal);
            this._onPropertyChanged(this, 'value', value, oldVal);
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
},{"../UIComponent":11,"./Primitives":10,"dom-lite":19}],10:[function(require,module,exports){
/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');


var exports = {};

/**
 *
 */
exports['HtmlPrimitive'] = UIComponent.extend('HtmlPrimitive', {
    _setter: {
        default: function (name, val) {
            if(val === void 0){
                this.el.removeAttribute(name);
            }else{
                this.el.setAttribute(name, val);
            }
            this._data[name] = val;
        },
        value: function (key, val) {
            if (!this.textNode) {
                this.textNode = this._factory.build('textNode');
                this._children.unshift(this.textNode);
            }
            this.textNode.set('value', val);
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
        this.el = document.createTextNode('');
    },
    _setter: {
        value: function (key, val) {
            this.el.nodeValue = val;
        }
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'input,label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,textarea,th,thead,tr,u,ul,header')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = document.createElement(name);
            }
        });
    });

/**
 *
 */
exports['a'] = exports['HtmlPrimitive'].extend('a', {
    createEl: function () {
        this.el = document.createElement('a');
    }
    /*_setter: {
     href: function (key, value) {
     this.el.href = value;
     }
     },
     _getter: {
     href: function () {
     return this.el.href;
     }
     }*/
});

module.exports = exports;
},{"../UIComponent":11,"dom-lite":19}],11:[function(require,module,exports){
/**
 * Created by zibx on 01.07.16.
 */
module.exports = (function () {
    'use strict';
    var AbstractComponent = require('./AbstractComponent'),
        ContentContainer = require('./ContentContainer'),
        observable = require('z-observable'),
        ObservableSequence = require('observable-sequence'),
        DQIndex = require('z-lib-structure-dqIndex');//,
        //document = require("dom-lite").document,
        //Factory = new require('./Factory');

    var UIComponent = AbstractComponent.extend('UIComponent', {
        on: observable.prototype.on,
        fire: observable.prototype.fire,
        //_factory: new Factory(),

        createEl: function () {
            this.el = document.createElement('div');
        },

        /**
         * Create own components
         *
         * @private
         */
        _init: function () {
            var iterator = this._ownComponents.iterator(), item, ctor, type, cmp;

            while (item = iterator.next()) {
                if (item instanceof ContentContainer) {
                    this._contentContainer = item;
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
            self.removeFromTree(child);
        });

        this.createEl();
        this._init();
        this._initChildren();

    });

    return UIComponent;
})();
},{"./AbstractComponent":2,"./ContentContainer":3,"observable-sequence":20,"z-lib-structure-dqIndex":24,"z-observable":26}],12:[function(require,module,exports){
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

        if (!propertyPipes) return;

        for (var i = 0; i < propertyPipes.length; i++) {
            var currentPipe = propertyPipes[i];

            var targetComponentName = currentPipe.targetComponent;

            var targetComponent = self._registredComponents[targetComponentName];
            if (targetComponent) {
                currentPipe.process(key, newValue, targetComponent);
            }
        }
    }
};

/**
 *
 * @param componentName String
 * @param component AbstractComponent
 */
EventManager.prototype.registerComponent = function (componentName, component) {
    this._registredComponents[componentName] = component;
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
    var length = bindingSources.length;
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
},{"./Components/AbstractComponent":2,"./Pipes/FiltratingPipe":15,"./Pipes/SimplePipe":17,"./QObject":18}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._addInputSource = function (source) {

    var newSourceBinding = {};

    if (typeof source === 'string' || source instanceof String) {
        var firstDotIndex = source.indexOf('.');
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
 * Executing on data change
 *
 * @param key
 * @param value
 * @param component
 */
AbstractPipe.prototype.process = function (key, value, component) {

    var sourceBinding = this.sourceBindings[key];
    if (sourceBinding)
        this.sourceBindings[key].value = value;

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
},{"./../Components/AbstractComponent":2,"./../QObject":18}],15:[function(require,module,exports){
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
},{"./../Components/AbstractComponent":2,"./../QObject":18,"./AbstractPipe":14}],16:[function(require,module,exports){
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

    component.set(this.targetPropertyName, value);
};

module.exports = MutatingPipe;
},{"../Components/AbstractComponent":2,"./../QObject":18,"./AbstractPipe":14}],17:[function(require,module,exports){
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
},{"./../Components/AbstractComponent":2,"./../QObject":18,"./AbstractPipe":14}],18:[function(require,module,exports){
(function(){
    'use strict';

    var components = {};

    /**
     * Top level class
     *
     * @constructor
     */
    function QObject( cfg ){
        cfg && this.apply( cfg );
    }

    var prototype = {

        /**
         * Copy all properties of object2 to object1, or object1 to self if object2 not set
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        apply: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
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
        applyIfNot: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
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
        applyPrivate: function( object1, object2 ){
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for( i in source )
                Object.defineProperty( target, i, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: source[i]
                } );
            return target;
        },

        /**
         * Convert Array to hash Object
         *
         * @param arr Array: Array to convert
         * @param [val=true] Any: value that would be setted to each member
         * @returns {{hash}}
         */
        arrayToObject: function( arr, val ){
            var i = 0, _i = arr.length,
                newVal = val || true,
                out = {};
            if( arr === null || arr === void 0 ) return out;

            for( ; i < _i; i++ ){
                out[ arr[ i ] ] = newVal;
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

            /** register to components */
            components[name] = Cmp;

            return Cmp;
        }
    };

    // makes prototype properties not enumerable
    QObject.prototype = prototype.applyPrivate.call( {}, prototype );
    prototype.apply(QObject, prototype);

    var deepApply = ['_setter', '_getter'],
        deepApplyHash = QObject.arrayToObject(deepApply);
    QObject._knownComponents = components;

    QObject.prototype._type="QObject";
    QObject._knownComponents['QObject'] = QObject;
    module.exports = QObject;
})();
},{}],19:[function(require,module,exports){


/**
 * @version    0.5.0
 * @date       2015-07-24
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */


// Void elements: http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
var voidElements = {
	AREA:1, BASE:1, BR:1, COL:1, EMBED:1, HR:1, IMG:1, INPUT:1,
	KEYGEN:1, LINK:1, MENUITEM:1, META:1, PARAM:1, SOURCE:1, TRACK:1, WBR:1
}
, hasOwn = Object.prototype.hasOwnProperty
, selector = require("selector-lite")
, elementGetters = {
	getElementById: function(id) {
		return selector.find(this, "#" + id, 1)
	},
	getElementsByTagName: function(tag) {
		return selector.find(this, tag)
	},
	getElementsByClassName: function(sel) {
		return selector.find(this, "." + sel.replace(/\s+/g, "."))
	},
	querySelector: function(sel) {
		return selector.find(this, sel, 1)
	},
	querySelectorAll: function(sel) {
		return selector.find(this, sel)
	}
}
, Node = {
	ELEMENT_NODE:                1,
	TEXT_NODE:                   3,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE:                8,
	DOCUMENT_NODE:               9,
	DOCUMENT_TYPE_NODE:         10,
	DOCUMENT_FRAGMENT_NODE:     11,
	nodeName:        null,
	parentNode:      null,
	ownerDocument:   null,
	childNodes:      null,
	get nodeValue() {
		return this.nodeType === 3 || this.nodeType === 8 ? this.data : null
	},
	set nodeValue(text) {
		return this.nodeType === 3 || this.nodeType === 8 ? (this.data = text) : null
	},
	get textContent() {
		return this.hasChildNodes() ? this.childNodes.map(function(child) {
			return child[ child.nodeType == 3 ? "data" : "textContent" ]
		}).join("") : this.nodeType === 3 ? this.data : ""
	},
	set textContent(text) {
		if (this.nodeType === 3) return (this.data = text)
		for (var node = this; node.firstChild;) node.removeChild(node.firstChild)
		node.appendChild(node.ownerDocument.createTextNode(text))
	},
	get firstChild() {
		return this.childNodes && this.childNodes[0] || null
	},
	get lastChild() {
		return this.childNodes && this.childNodes[ this.childNodes.length - 1 ] || null
	},
	get previousSibling() {
		return getSibling(this, -1)
	},
	get nextSibling() {
		return getSibling(this, 1)
	},
	get innerHTML() {
		return Node.toString.call(this)
	},
	set innerHTML(html) {
		var match, child
		, node = this
		, tagRe = /<!(--([\s\S]*?)--|\[[\s\S]*?\]|[\s\S]*?)>|<(\/?)([^ \/>]+)([^>]*)>|[^<]+/mg
		, attrRe = /([^= ]+)\s*=\s*(?:("|')((?:\\?.)*?)\2|(\S+))/g

		for (; node.firstChild; ) node.removeChild(node.firstChild)

		for (; (match = tagRe.exec(html)); ) {
			if (match[3]) {
				node = node.parentNode
			} else if (match[4]) {
				child = node.ownerDocument.createElement(match[4])
				if (match[5]) {
					match[5].replace(attrRe, setAttr)
				}
				node.appendChild(child)
				if (!voidElements[child.tagName]) node = child
			} else if (match[2]) {
				node.appendChild(node.ownerDocument.createComment(htmlUnescape(match[2])))
			} else if (match[1]) {
				node.appendChild(node.ownerDocument.createDocumentType(match[1]))
			} else {
				node.appendChild(node.ownerDocument.createTextNode(htmlUnescape(match[0])))
			}
		}

		return html

		function setAttr(_, name, q, a, b) {
			child.setAttribute(name, htmlUnescape(a || b || ""))
		}
	},
	get outerHTML() {
		return this.toString()
	},
	set outerHTML(html) {
		var frag = this.ownerDocument.createDocumentFragment()
		frag.innerHTML = html
		this.parentNode.replaceChild(frag, this)
		return html
	},
	get htmlFor() {
		return this["for"]
	},
	set htmlFor(value) {
		this["for"] = value
	},
	get className() {
		return this["class"] || ""
	},
	set className(value) {
		this["class"] = value
	},
	get style() {
		return this.styleMap || (this.styleMap = new StyleMap())
	},
	set style(value) {
		this.styleMap = new StyleMap(value)
	},
	hasChildNodes: function() {
		return this.childNodes && this.childNodes.length > 0
	},
	appendChild: function(el) {
		return this.insertBefore(el)
	},
	insertBefore: function(el, ref) {
		var node = this
		, childs = node.childNodes

		if (el.nodeType == 11) {
			while (el.firstChild) node.insertBefore(el.firstChild, ref)
		} else {
			if (el.parentNode) el.parentNode.removeChild(el)
			el.parentNode = node

			// If ref is null, insert el at the end of the list of children.
			childs.splice(ref ? childs.indexOf(ref) : childs.length, 0, el)
		}
		return el
	},
	removeChild: function(el) {
		var node = this
		, index = node.childNodes.indexOf(el)
		if (index == -1) throw new Error("NOT_FOUND_ERR")

		node.childNodes.splice(index, 1)
		el.parentNode = null
		return el
	},
	replaceChild: function(el, ref) {
		this.insertBefore(el, ref)
		return this.removeChild(ref)
	},
	cloneNode: function(deep) {
		var key
		, node = this
		, clone = new node.constructor(node.tagName || node.data)
		clone.ownerDocument = node.ownerDocument

		if (node.hasAttribute) {
			for (key in node) if (node.hasAttribute(key)) clone[key] = node[key].valueOf()
		}

		if (deep && node.hasChildNodes()) {
			node.childNodes.forEach(function(child) {
				clone.appendChild(child.cloneNode(deep))
			})
		}
		return clone
	},
	toString: function() {
		return this.hasChildNodes() ? this.childNodes.reduce(function(memo, node) {
			return memo + node
		}, "") : ""
	}
}



function extendNode(obj, extras) {
	obj.prototype = Object.create(Node)
	for (var key, i = 1; (extras = arguments[i++]); )
		for (key in extras) obj.prototype[key] = extras[key]
	obj.prototype.constructor = obj
}

function camelCase(str) {
	return str.replace(/[ _-]+([a-z])/g, function(_, a) { return a.toUpperCase() })
}

function hyphenCase(str) {
	return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function htmlEscape(str) {
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function htmlUnescape(str) {
	return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&")
}

function StyleMap(style) {
	var styleMap = this
	if (style) style.split(/\s*;\s*/g).map(function(val) {
		val = val.split(/\s*:\s*/)
		if(val[1]) styleMap[val[0] == "float" ? "cssFloat" : camelCase(val[0])] = val[1]
	})
}

StyleMap.prototype.valueOf = function() {
	var styleMap = this
	return Object.keys(styleMap).map(function(key) {
		return (key == "cssFloat" ? "float: " : hyphenCase(key) + ": ") + styleMap[key]
	}).join("; ")
}

function getSibling(node, step) {
	var silbings = node.parentNode && node.parentNode.childNodes
	, index = silbings && silbings.indexOf(node)

	return silbings && index > -1 && silbings[ index + step ] || null
}



function DocumentFragment() {
	this.childNodes = []
}

extendNode(DocumentFragment, {
	nodeType: 11,
	nodeName: "#document-fragment"
})

function Attr(node, name) {
	this.ownerElement = node
	this.name = name.toLowerCase()
}

Attr.prototype = {
	get value() { return this.ownerElement.getAttribute(this.name) },
	set value(val) { this.ownerElement.setAttribute(this.name, val) },
	toString: function() {
		return this.name + "=\"" + htmlEscape(this.value) + "\""
	}
}

function escapeAttributeName(name) {
	name = name.toLowerCase()
	if (name === "constructor" || name === "attributes") return name.toUpperCase()
	return name
}

function HTMLElement(tag) {
	var element = this
	element.nodeName = element.tagName = tag.toUpperCase()
	element.localName = tag.toLowerCase()
	element.childNodes = []
}

extendNode(HTMLElement, elementGetters, {
	matches: function(sel) {
		return selector.matches(this, sel)
	},
	closest: function(sel) {
		return selector.closest(this, sel)
	},
	namespaceURI: "http://www.w3.org/1999/xhtml",
	nodeType: 1,
	localName: null,
	tagName: null,
	styleMap: null,
	hasAttribute: function(name) {
		name = escapeAttributeName(name)
		return name != "style" ? hasOwn.call(this, name) :
		!!(this.styleMap && Object.keys(this.styleMap).length)
	},
	getAttribute: function(name) {
		name = escapeAttributeName(name)
		return this.hasAttribute(name) ? "" + this[name] : null
	},
	setAttribute: function(name, value) {
		this[escapeAttributeName(name)] = "" + value
	},
	removeAttribute: function(name) {
		name = escapeAttributeName(name)
		this[name] = ""
		delete this[name]
	},
	toString: function() {
		var attrs = this.attributes.join(" ")
		return "<" + this.localName + (attrs ? " " + attrs : "") + ">" +
		(voidElements[this.tagName] ? "" : this.innerHTML + "</" + this.localName + ">")
	}
})

Object.defineProperty(HTMLElement.prototype, "attributes", {
	get: function() {
		var key
		, attrs = []
		, element = this
		for (key in element) if (key === escapeAttributeName(key) && element.hasAttribute(key))
			attrs.push(new Attr(element, escapeAttributeName(key)))
		return attrs
	}
})

function ElementNS(namespace, tag) {
	var element = this
	element.namespaceURI = namespace
	element.nodeName = element.tagName = element.localName = tag
	element.childNodes = []
}

ElementNS.prototype = HTMLElement.prototype

function Text(data) {
	this.data = data
}

extendNode(Text, {
	nodeType: 3,
	nodeName: "#text",
	toString: function() {
		return htmlEscape("" + this.data)
	}
})

function Comment(data) {
	this.data = data
}

extendNode(Comment, {
	nodeType: 8,
	nodeName: "#comment",
	toString: function() {
		return "<!--" + this.data + "-->"
	}
})

function DocumentType(data) {
	this.data = data
}

extendNode(DocumentType, {
	nodeType: 10,
	toString: function() {
		return "<!" + this.data + ">"
	}
})

function Document() {
	this.childNodes = []
	this.documentElement = this.createElement("html")
	this.appendChild(this.documentElement)
	this.body = this.createElement("body")
	this.documentElement.appendChild(this.body)
}

function own(Element) {
	return function($1, $2) {
		var node = new Element($1, $2)
		node.ownerDocument = this
		return node
	}
}

extendNode(Document, elementGetters, {
	nodeType: 9,
	nodeName: "#document",
	createElement: own(HTMLElement),
	createElementNS: own(ElementNS),
	createTextNode: own(Text),
	createComment: own(Comment),
	createDocumentType: own(DocumentType), //Should be document.implementation.createDocumentType(name, publicId, systemId)
	createDocumentFragment: own(DocumentFragment)
})

module.exports = {
	document: new Document(),
	StyleMap: StyleMap,
	Node: Node,
	HTMLElement: HTMLElement,
	Document: Document
}


},{"selector-lite":21}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){


/*
 * @version    0.1.1
 * @date       2015-05-10
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(exports) {
	var undef
	, selectorRe = /([.#:[])([-\w]+)(?:\((.+?)\)|([~^$*|]?)=(("|')(?:\\?.)*?\6|[-\w]+))?]?/g
	, selectorLastRe = /([~\s>+]*)(?:("|')(?:\\?.)*?\2|\(.+?\)|[^\s+>])+$/
	, selectorSplitRe = /\s*,\s*(?=(?:[^'"()]|"(?:\\?.)*?"|'(?:\\?.)*?'|\(.+?\))+$)/
	, selectorCache = {}
	, selectorMap = {
		"any": "m(_,v)",
		"empty": "!_.lastChild",
		"enabled": "!m(_,':disabled')",
		"first-child": "(a=_.parentNode)&&a.firstChild==_",
		"first-of-type": "!p(_,_.tagName)",
		"lang": "m(c(_,'[lang]'),'[lang|='+v+']')",
		"last-child": "(a=_.parentNode)&&a.lastChild==_",
		"last-of-type": "!n(_,_.tagName)",
		"link": "m(_,'a[href]')",
		"not": "!m(_,v)",
		"nth-child": "(a=2,'odd'==v?b=1:'even'==v?b=0:a=1 in(v=v.split('n'))?(b=v[1],v[0]):(b=v[0],0),v=_.parentNode.childNodes,v=1+v.indexOf(_),0==a?v==b:('-'==a||0==(v-b)%a)&&(0<a||v<=b))",
		"only-child": "(a=_.parentNode)&&a.firstChild==a.lastChild",
		"only-of-type": "!p(_,_.tagName)&&!n(_,_.tagName)",
		"optional": "!m(_,':required')",
		"root": "(a=_.parentNode)&&!a.tagName",
		".": "~_.className.split(/\\s+/).indexOf(a)",
		"#": "_.id==a",
		"^": "!a.indexOf(v)",
		"|": "a.split('-')[0]==v",
		"$": "a.slice(-v.length)==v",
		"~": "~a.split(/\\s+/).indexOf(v)",
		"*": "~a.indexOf(v)",
		">>": "m(_.parentNode,v)",
		"++": "m(_.previousSibling,v)",
		"~~": "p(_,v)",
		"": "c(_.parentNode,v)"
	}

	selectorMap["nth-last-child"] = selectorMap["nth-child"].replace("1+", "v.length-")

	function selectorFn(str) {
		// jshint evil:true
		return selectorCache[str] ||
		(selectorCache[str] = Function("m,c,n,p", "return function(_,v,a,b){return " +
			str.split(selectorSplitRe).map(function(sel) {
				var relation, from
				, rules = ["_&&_.nodeType==1"]
				, parentSel = sel.replace(selectorLastRe, function(_, _rel, a, start) {
					from = start + _rel.length
					relation = _rel.trim()
					return ""
				})
				, tag = sel.slice(from).replace(selectorRe, function(_, op, key, subSel, fn, val, quotation) {
					rules.push(
						"((v='" +
						(subSel || (quotation ? val.slice(1, -1) : val) || "").replace(/'/g, "\\'") +
						"'),(a='" + key + "'),1)"
						,
						selectorMap[op == ":" ? key : op] ||
						"(a=_.getAttribute(a))" +
						(fn ? "&&" + selectorMap[fn] : val ? "==v" : "")
					)
					return ""
				})

				if (tag && tag != "*") rules[0] += "&&_.tagName=='" + tag.toUpperCase() + "'"
				if (parentSel) rules.push("(v='" + parentSel + "')", selectorMap[relation + relation])
				return rules.join("&&")
			}).join("||") + "}"
		)(matches, closest, next, prev))
	}


	function walk(next, el, sel, first, nextFn) {
		var out = []
		sel = selectorFn(sel)
		for (; el; el = el[next] || nextFn && nextFn(el)) if (sel(el)) {
			if (first) return el
			out.push(el)
		}
		return first ? null : out
	}

	function find(node, sel, first) {
		return walk("firstChild", node.firstChild, sel, first, function(el) {
			var next = el.nextSibling
			while (!next && ((el = el.parentNode) !== node)) next = el.nextSibling
			return next
		})
	}

	function matches(el, sel) {
		return !!selectorFn(sel)(el)
	}

	function closest(el, sel) {
		return walk("parentNode", el, sel, 1)
	}

	function next(el, sel) {
		return walk("nextSibling", el.nextSibling, sel, 1)
	}

	function prev(el, sel) {
		return walk("previousSibling", el.previousSibling, sel, 1)
	}


	exports.find = find
	exports.fn = selectorFn
	exports.matches = matches
	exports.closest = closest
	exports.next = next
	exports.prev = prev
	exports.selectorMap = selectorMap
}(this)


},{}],22:[function(require,module,exports){
module.exports = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b};

},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"z-lib-structure-dequeue":23}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{"z-lib":25}]},{},[1])(1)
});