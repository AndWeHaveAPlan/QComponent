/**
 * Created by zibx on 05.08.16.
 */
var Core = require('../Core');
var assert = require('chai').assert;

describe("Basic functionality", function () {
    it("should throw syntax error", function () {
        var p = new Core.Compile.Linker({
            mapping: {
                id: 'id',
                code: 'code'
            }
        });
        var obj = p.add({
            id: 'some.qs',
            code: 'def UIComponent c1\n'+
                '  public Number c: {{7--}}'
        });
        assert.throws(p.getMetadata.bind(p), Error, 'Reactive expression error `Syntax error` (some.qs:2:24)');
/*        var meta = p.getMetadata(),
            subObj = {};
        console.log('metadata extracted');
        for (var i in meta)
            meta[i].type && (subObj[i] = meta[i]);
        var compiled = Core.Compile.Compiler.compile(subObj);*/

    });
    it("should throw syntax error", function () {
        var p = new Core.Compile.Linker({
            mapping: {
                id: 'id',
                code: 'code'
            }
        });
        var obj = p.add({
            id: 'some.qs',
            code: 'def UIComponent c1\n'+
'  public Number a: 8\n'+
'  public Number c: {{7-a.value-}}'
        });
        assert.throws(p.getMetadata.bind(p), Error, 'Reactive expression error `Syntax error` (some.qs:3:33)');
    });
});