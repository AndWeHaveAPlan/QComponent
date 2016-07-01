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
function SimplePipe(source, target) {
    AbstractPipe.call(this, source, target);
}

SimplePipe.prototype = Object.create(AbstractPipe.prototype);
SimplePipe.prototype.constructor = AbstractPipe;

module.exports = SimplePipe;