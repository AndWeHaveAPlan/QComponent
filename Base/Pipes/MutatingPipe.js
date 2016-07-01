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
 * @param value
 * @param component
 */
MutatingPipe.prototype.process = function (value, component) {
    var mutators = this._mutators;
    var length = mutators.length;

    for (var i = 0; i < length; i++) {
        value = mutators[i](value);
    }

    component.set(this.targetPropertyName, value);
};

module.exports = MutatingPipe;