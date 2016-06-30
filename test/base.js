/**
 * Created by ravenor on 29.06.16.
 */
var Base = require('../Base');
var assert = require('chai').assert;

var QObject = Base.QObject;
var Component = Base.Component;

describe("Basic functionality", function () {
    it("should can apply", function () {
        var obj1 = new QObject();
        var obj2 = new QObject();

        obj2["testField"] = "testFieldValue";
        obj2["testFunction"] = function (a, b) {
            return a + b;
        };

        obj1.apply(obj2);

        assert.equal(obj1["testField"], obj1["testField"]);
        assert.equal(obj1["testFunction"](2, 4), obj1["testFunction"](2, 4));
    });
});