function QObject() {
    this.a=1;
}

QObject.prototype = Object.create(Object);

/**
 * Copy all properties of one object to another
 *
 * @returns {*} Changed object
 * @param object1
 * @param object2
 */
QObject.prototype.apply = function (object1, object2) {
    var i;
    var target = object2 || object1;
    var source = object2 ? object1 : this;

    for (i in source)
        target[i] = source[i];
    return source;
};

/**
 * Copy all properties of one object to another
 * Does not copy existed properties
 *
 * @returns {*} Changed object
 * @param object1
 * @param object2
 */
QObject.prototype.applyIfNot = function (object1, object2) {
    var i, undefined = void 0;
    var target = object2 || object1;
    var source = object2 ? object1 : this;

    for (i in source)
        source[i] === undefined && ( target[i] = source[i] );

    return source;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Sequence.prototype==
module.exports.Base={};
module.exports.Base.QObject = QObject;