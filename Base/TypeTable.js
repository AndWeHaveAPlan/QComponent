/// <reference path="../quokka.d.ts" />

var QObject = require('./QObject');
var AbstractComponent = require('./AbstractComponent');

var q = new QObject();
var ac = new AbstractComponent();

//ac.get

var types = {};

module.exports = {
    add: function (ctor) {
        types[ctor._type] = {
            name: ctor._type,
            constructor: factory,
            parent: ctor.prototype._type
        };
    },
    get: function (name) {
        return types[name];
    },
    construct: function (typeName) {
        var type = this.get(typeName);
        if (!type) {
            throw new Error('unknown type ' + typeName);
            return;
        }


    }
};