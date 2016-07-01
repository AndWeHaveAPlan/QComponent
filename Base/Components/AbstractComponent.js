/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex' ),

    /** all known components*/
    components = {};

/**
 * TODO: move to own file
 *
 * @returns Function
 */
function createMulticastDelegate() {
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
}

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

    if (!this.leaf){
        /**
         * Child Components
         *
         * @type Array<AbstractComponent>
         * @private
         */
        this._children = new ObservableSequence( new DQIndex( 'id' ) );

        // instantly modify child components on append
        this._children.on('add', function( child ){
            child.parent = self;
        });
    }

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = createMulticastDelegate();

    if(!this.eventManager)
        this.eventManager = AbstractComponent.eventManager;

    if (this.id)
        this.eventManager.registerComponent(this.id, this);
}

AbstractComponent.prototype = new QObject({

    // mutators
    _setter: {
        default: function (name, value) {
            var oldValue = this._data[name];
            this._data[name] = value;
            //TODO проверки надо бы всякие
            this._onPropertyChanged(this, name, value, oldValue);
        }
    },

    // accessors
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
    addChild: function( component ){
        this._children.push(component);
        return this;
    },

    _type: 'AbstractComponent'
});


//new QObject();
//console.log((AbstractComponent.prototype.apply = function(){}).toString())
//console.log(AbstractComponent.prototype.apply({a:1},{b:2}))
/**
 * Some kind of static field
 *
 * @type EventManager
 */
AbstractComponent.eventManager = new EventManager();
AbstractComponent._type = AbstractComponent.prototype._type;

/**
 * Extends class
 * @param name String: Name of component
 * @param cfg Object: Config of component
 * @param [init] Function: Custom constructor
 */
AbstractComponent.extend = function( name, cfg, init){
    var deepApply = ['_setter', '_getter'],
        deepApplyHash = QObject.arrayToObject(deepApply ),
        cmpCfg = {}, i, val,
        overlays, proto,

        /** what is extending */
        original = components[this._type];

    for( i in cfg ){
        val = cfg[i];
        if(!(i in deepApplyHash))
            cmpCfg[i] = val;
    }

    // constructor;
    var Cmp = init || function(cfg){
            original.call(this, cfg);
        };

    overlays = deepApply.reduce( function( storage, deepName ){
        if( deepName in cfg ){
            storage[deepName] = cfg[deepName];
            delete cfg[deepName];
        }
        return storage;
    }, {} );

    proto = Cmp.prototype = Object.create( original.prototype ).apply( cfg );

    for( i in overlays ){
        proto[i] = QObject.apply( Object.create( proto[i] ), overlays[i] );
    }

    Cmp._type = Cmp.prototype._type = name;
    Cmp.extend = AbstractComponent.extend;

    /** register to components */
    components[name] = Cmp;

    return Cmp;
};
AbstractComponent._knownComponents = components;

components['AbstractComponent'] = module.exports = AbstractComponent;