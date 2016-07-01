/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("./../Component");
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
 * @param value
 * @param component
 */
FiltratingPipe.prototype.process = function (value, component) {
    var filters = this._filters;
    var length = filters.length;

    var result = true;

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