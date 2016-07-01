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

FiltratingPipe.prototype = Object.create(AbstractPipe);
FiltratingPipe.prototype.constructor = FiltratingPipe;

/**
 *
 * @param filterFunction Function
 */
FiltratingPipe.prototype.addFilter = function (filterFunction) {
    this._filters.push(filterFunction)
};

/**
 *
 * @param newVal
 */
FiltratingPipe.prototype.applyFilters = function (newVal) {
    var filters = this._filters;
    var length = filters.length;

    var result = true;

    for (var i = 0; i < length; i++) {
        if (!filters[i](newVal)) {
            result = false;
        }
    }

    return result;
};

module.exports = FiltratingPipe;