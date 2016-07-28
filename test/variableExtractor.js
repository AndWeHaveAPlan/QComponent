/**
 * Created by zibx on 28.07.16.
 */
var Core = require('../Core');
var assert = require('chai').assert;



describe("variable extractor", function () {
    var VariableExtractor = Core.Compile.VariableExtractor;

    it("should work in simple cases", function (){
        var vars = VariableExtractor.parse('a+c;var d = 2+b');
        assert.deepEqual(vars.getUnDefined(), {a:true, b: true, c: true});
    });


    it("should work in complex cases", function (){
        var vars = VariableExtractor.parse('l=a+c.f+ x.e +a.e+c;var a, d = 2+b+a.g.b.d');
        assert.deepEqual(vars.getFullUnDefined(), {
            l: { l: true },
            c: { 'c,f': true, c: true },
            x: { 'x,e': true },
            b: { b: true }});
    });
});