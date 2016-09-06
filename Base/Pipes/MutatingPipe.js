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
    this._mutators.push(mutatorFunction);
    return this;
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

    var value = mutators[0].apply(component, args);

    for (var i = 1; i < length; i++) {
        value = mutators[i].call(component, value);
    }

    if (value !== void (0))
        component.set(this.targetPropertyName, value);
};

module.exports = MutatingPipe;