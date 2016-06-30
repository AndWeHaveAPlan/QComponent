/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require("./QObject");
var Component = require("./Component");

/**
 *
 * @param source {String, String}
 * @param target {String, String}
 *
 * @constructor
 */
function Pipe(source, target) {
    this.sourceComponent = source.component;
    this.sourcePropertyName = source.property;

    this.targetComponent = target.component;
    this.targetPropertyName = target.property;
}

Pipe.prototype = new QObject();

module.exports = Pipe;