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
function SimplePipe(source, target) {
    AbstractPipe.call(this, source, target);
}

SimplePipe.prototype = Object.create(AbstractPipe);
SimplePipe.prototype.constructor = SimplePipe;

module.exports = SimplePipe;