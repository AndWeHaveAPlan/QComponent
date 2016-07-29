/**
 * Created by zibx on 28.07.16.
 */
var Core = require('../Core');
var assert = require('chai').assert;



describe("variable extractor", function () {
    var VariableExtractor = Core.Compile.VariableExtractor;

    var dontGiveAShitCompare = function (origin, partial) {
        for(var i in partial)
            if(!origin[i])
                return false;
            else if(typeof partial[i] === 'object')
                if(!dontGiveAShitCompare(origin[i], partial[i])) {
                    return false;
                }
        return true;
    };

    it("should work in simple cases", function (){
        var vars = VariableExtractor.parse('a+c;var d = 2+b');
        assert.deepEqual(vars.getUnDefined(), {a:true, b: true, c: true});

    });


    it("should work in complex cases", function (){
        var vars = VariableExtractor.parse('l=a+c.f+ x.e +a.e+c;var a, d = 2+b+a.g.b.d');
        assert.equal(dontGiveAShitCompare(vars.getFullUnDefined(), {
            l: { l: true },
            c: { 'c.f': true, c: true },
            x: { 'x.e': true },
            b: { b: true }}), true);
    });
    it("braces", function (){
        var vars = VariableExtractor.parse('a.l[m]');
        assert.equal(dontGiveAShitCompare(vars.getFullUnDefined(), {
            a: { 'a.l.~m': true },
            m: { m: true}
        }), true);
    });

    it("braces", function (){
        var vars = VariableExtractor.parse('EN[\'MainWindow.Menu.File.Exit\'][a]');
        console.log(JSON.stringify(vars.getFullUnDefined()))
        assert.equal(dontGiveAShitCompare(vars.getFullUnDefined(), {
            EN: {'EN.MainWindow\\.Menu\\.File\\.Exit.~a': true}
        }), true);
    });
});