/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var EventManager = require("./../EventManager"),
    uuid = require("tiny-uuid"),
    ObservableSequence = require("observable-sequence"),
    DQIndex = require("z-lib-structure-dqIndex");

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
function Component(cfg) {

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
         * @type Array<Component>
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
        this.eventManager = Component.eventManager;

    if (this.id)
        this.eventManager.registerComponent(this.id, this);
}

Component.prototype = new QObject({

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
     * @param component Component: Component to add
     */
    addChild: function( component ){
        this._children.push(component);
        return this;
    }
});


//new QObject();
//console.log((Component.prototype.apply = function(){}).toString())
//console.log(Component.prototype.apply({a:1},{b:2}))
/**
 * Some kind of static field
 *
 * @type EventManager
 */
Component.eventManager = new EventManager();
Component.extend =


module.exports = Component;