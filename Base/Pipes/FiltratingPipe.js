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