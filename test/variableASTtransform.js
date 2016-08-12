/**
 * Created by zibx on 12.08.16.
 */
var Core = require('../Core');
var assert = require('chai').assert,
    escodegen = require('escodegen');



describe("ast transformations", function () {
    var VariableExtractor = Core.Compile.VariableExtractor;

    it("should work in simple cases", function () {
        var vars = VariableExtractor.parse('a=a+1'), o = vars.getFullUnDefined();
        console.log(o.a);
        o.a.a[0]._id = '22'
        console.log(escodegen.generate(o.a.a[0]))
    });
});