/**
 * Top level class
 *
 * @constructor
 */
function QObject() {
}

QObject.prototype = Object.create(Object);

/**
 * Copy all properties of object2 to object1, or object1 to self if object2 not set
 *
 * @returns {*} Changed object
 * @param object1 Object
 * @param object2 Object
 */
QObject.prototype.apply = function (object1, object2) {
    var i;
    var source = object2 || object1;
    var target = object2 ? object1 : this;

    for (i in source)
        target[i] = source[i];
    return source;
};

/**
 * Copy all properties of one object to another
 * Does not copy existed properties
 *
 * @returns {*} Changed object
 * @param object1 Object
 * @param object2 Object
 */
QObject.prototype.applyIfNot = function (object1, object2) {
    var i, undefined = void 0;
    var source = object2 || object1;
    var target = object2 ? object1 : this;

    for (i in source)
        source[i] === undefined && ( target[i] = source[i] );

    return source;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = QObject;