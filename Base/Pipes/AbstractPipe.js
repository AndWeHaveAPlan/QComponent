/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./../QObject");
var Component = require("./../Component");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 * @abstract
 */
function AbstractPipe(source, target) {
    QObject.call(this, {});

    this.sourceComponent = source.component;
    this.sourcePropertyName = source.property;

    this.targetComponent = target.component;
    this.targetPropertyName = target.property;
}

AbstractPipe.prototype = Object.create(QObject);
AbstractPipe.constructor = AbstractPipe;

module.exports = AbstractPipe;