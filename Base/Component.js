/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var EventManager = require("./EventManager");

/**
 * TODO: move to own file
 *
 * @returns Function
 */
function createMulticastDelegate() {
    var delegate =
        function () {
            for (var i = 0; i < delegate.flist.length; i++) {
                delegate.flist[i].apply(this, arguments);
            }
        };

    delegate.flist = [];
    delegate.addFunction = function (fn) {
        delegate.flist.push(fn);
    };

    return delegate;
}

/**
 * Base class for all components
 *
 * @constructor
 */
function Component(cname, parent) {
    var self = this;

    /**
     * Name of this component
     */
    this.cname = cname;

    /**
     *
     * @type {{}}
     * @private
     */
    this._data = {};

    /**
     * Child Components
     * TODO: а не сделать ли тут не просто массив а что-то вроде коллекции? специально для компонентов
     *
     * @type Array<Component>
     * @private
     */
    this._childs = [];

    /**
     * Parent component
     *
     * @type Component
     */
    this._parent = parent;

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = createMulticastDelegate();

    this._mutators = {
        default: function (name, value) {
            var oldValue = self._data[name];
            self._data[name] = value;
            //TODO проверки надо бы всякие
            self._onPropertyChanged(self, name, value, oldValue);
        }
    };

    this._accesors = {
        default: function (name) {
            return self._data[name];
        }
    };


    if (this.cname)
        Component.eventManager.registerComponent(cname, self);
}

Component.prototype = new QObject();//new QObject();
//console.log((Component.prototype.apply = function(){}).toString())
//console.log(Component.prototype.apply({a:1},{b:2}))
/**
 * Some kind of static field
 *
 * @type EventManager
 */
Component.eventManager = new EventManager();

/**
 * Get property from component
 *
 * @param name String
 */
Component.prototype.get = function (name) {
    var accesor = this._accesors[name] || this._accesors.default;

    return accesor.call(this, name);
};

/**
 * Set property to component
 *
 * @param name String
 * @param value Object
 */
Component.prototype.set = function (name, value) {
    var mutator = this._mutators["name"] || this._mutators.default;

    mutator.call(this, name, value);
};

/**
 * Subscribe to _onPropertyChanged event
 *
 * @param callback Function
 */
Component.prototype.subscribe = function (callback) {
    this._onPropertyChanged.addFunction(callback);
};

module.exports = Component;