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
function Component(cname, cfg) {
    var self = this;

    QObject.apply(this, cfg);

    /**
     * Name of this component
     */
    this.cname = cname;

    /**
     * Public properties
     *
     * @type {{}}
     * @private
     */
    this._data = {};

    /**
     * All internal Component must be registred here
     *
     * @type EventManager
     */
    this._eventManager = new EventManager();

    /**
     * Child Components
     * TODO: а не сделать ли тут не просто массив а что-то вроде коллекции? специально для компонентов
     *
     * @type Array<Component>
     * @private
     */
    this._childs = [];

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

    this._eventManager.registerComponent(this.cname, self)
}

Component.prototype = Object.create(QObject);
Component.constructor = Component;

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