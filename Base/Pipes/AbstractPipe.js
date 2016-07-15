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

AbstractPipe.create = function () {

};

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._parseInput = function (input) {

    var newSourceBinding = {};

    if (typeof input === 'string' || input instanceof String) {
        var firstDotIndex = input.indexOf('.');
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