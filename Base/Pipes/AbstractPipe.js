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
        this._addInputSource(source);
    }

    var parsedTarget = this._parseTarget(target);

    this.targetComponent = parsedTarget.component;
    this.targetPropertyName = parsedTarget.property;
}

AbstractPipe.prototype = Object.create(QObject.prototype);

AbstractPipe.create = function () {

};

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._parseTarget = function (input) {

    var result = {
        component: '',
        property: ''
    };

    if (!(typeof input === 'string' || input instanceof String)) {
        result.component = input.component;
        result.property = input.property;
    } else {
        var parts = input.split('.');

        result.property = parts.splice(1).join('.');
        result.component = parts.join('.');
    }

    return result;
};

/**
 *
 * @param source
 * @private
 */
AbstractPipe.prototype._addInputSource = function (source) {
    var newSourceBinding = {};

    if (!(typeof source === 'string' || source instanceof String)) {
        source = source.component + '.' + source.property;
    }

    var propParts = source.split('.');

    if (propParts.length >= 2) {
        newSourceBinding.key = propParts.slice(0, 2).join('.');// source;
        newSourceBinding.componentName = propParts[0];
        newSourceBinding.propertyName = propParts.slice(1, propParts.length).join('.');
    } else if (propParts.length == 1) {
        newSourceBinding.key = propParts[0];
        newSourceBinding.componentName = '';
        newSourceBinding.propertyName = propParts[0];
    } else {
        return;
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

    var changed = false;

    if (sourceBinding) {
        changed = this.sourceBindings[key].value !== value;
        this.sourceBindings[key].value = value;
    }

    //if (changed)
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