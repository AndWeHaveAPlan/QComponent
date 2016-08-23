/**
 * Created by ravenor on 23.08.16.
 */

var AbstractComponent = require('../Components/AbstractComponent');

function dumpComponent(cmp) {
    var obj = {};
    var iterator = cmp._children.iterator(), item;

    obj.type = cmp._type;
    obj.data = cmp._data;
    obj.children = [];

    while (item = iterator.next()) {
        obj.children.push(dumpComponent(item));
    }
    return obj;
}

function restoreComponent(cmpDump, afterConstruct) {
    var ctor = QObject._knownComponents[cmpDump.type];
    if (!ctor)
        throw new Error('unknown type ' + cmpDump.type);
    var cmp = new ctor(cmpDump.data);
    for (var i = 0; i < cmpDump.children.length; i++) {
        cmp._children.push(restoreComponent(cmpDump.children[i]));
    }
    if (afterConstruct)
        afterConstruct(cmp);
    return cmp;
}

module.exports = {

    /**
     *
     * @param {AbstractComponent} cmp
     * @param {bool} childrenOnly
     * @param {Function} afterConstruct
     * @returns {*}
     */
    dump: function (cmp, childrenOnly) {

        if (!(cmp instanceof AbstractComponent))
            throw new Error('First argument must be AbstractComponent');

        if (childrenOnly) {
            var ret = [];
            var iterator = cmp._children.iterator(), item;
            while (item = iterator.next()) {
                ret.push(dumpComponent(item));
            }
            return ret;
        } else {
            return [dumpComponent(cmp)];
        }
    },
    /**
     *
     * @param {[]} dumpArray
     * @returns {[AbstractComponent]}
     * @param afterConstruct
     */
    restore: function (dumpArray, afterConstruct) {
        var ret = [];
        for (var d = 0; d < dumpArray.length; d++) {
            var dump = dumpArray[d];
            var ctor = QObject._knownComponents[dump.type];

            if (!ctor)
                throw new Error('unknown type ' + dump.type);

            var cmp = new ctor(dump.data);
            for (var i = 0; i < dump.children.length; i++) {
                var child = restoreComponent(dump.children[i], afterConstruct);
                cmp._children.push(child);
            }

            if (afterConstruct)
                afterConstruct(cmp);

            ret.push(cmp);
        }
        return ret;
    }
};