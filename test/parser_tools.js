/**
 * Created by zibx on 7/14/16.
 */
var assert = require('chai').assert;
var Core = require('../Core' ),
    tools = Core.Compile.tools;

describe('Parser tools', function() {

    it('split one token', function () {
        var data = [{type: 'text', pureData: 'a*b*c'}];
        var out = tools.split(data, '*');
        assert.deepEqual(out, [
            [{type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b'}],
            [{type: 'text', pureData: 'c'}]
        ]);

        var out = tools.split(data, '*', 2);
        assert.deepEqual(out, [
            [{type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b*c'}]
        ]);
    });
    it('split more tokens', function () {
        var data = [{type: 'quote', pureData: '"1"'},
            {type: 'text', pureData: 'a*b*c'},
            {type: 'brace', pureData: '{{234}}'}];
        var out = tools.split(data, '*');
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'}, {type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b'}],
            [{type: 'text', pureData: 'c'},{type: 'brace', pureData: '{{234}}'}]
        ]);

        var out = tools.split(data, '*', 2);
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'}, {type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b*c'},{type: 'brace', pureData: '{{234}}'}]
        ]);
    });
    it('split more last', function () {
        var data = [
            {type: 'text', pureData: 'a*b*c'},
            {type: 'brace', pureData: '{{234}}'}];
        var out = tools.split(data, '*');
        assert.deepEqual(out, [
            [{type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b'}],
            [{type: 'text', pureData: 'c'},{type: 'brace', pureData: '{{234}}'}]
        ]);

        var out = tools.split(data, '*', 2);
        assert.deepEqual(out, [
            [{type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b*c'},{type: 'brace', pureData: '{{234}}'}]
        ]);
    });
    it('split more first', function () {
        var data = [{type: 'quote', pureData: '"1"'},
            {type: 'text', pureData: 'a*b*c'}];
        var out = tools.split(data, '*');
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'}, {type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b'}],
            [{type: 'text', pureData: 'c'}]
        ]);

        var out = tools.split(data, '*', 2);
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'}, {type: 'text', pureData: 'a'}],
            [{type: 'text', pureData: 'b*c'}]
        ]);
    });
    it('split no match', function () {
        var data = [{type: 'quote', pureData: '"1"'},
            {type: 'text', pureData: 'a*b*c'},
            {type: 'brace', pureData: '{{234}}'}];
        var out = tools.split(data, ':');
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'},
                {type: 'text', pureData: 'a*b*c'},
                {type: 'brace', pureData: '{{234}}'}]
        ]);

        // should return empty array as second el
        var out = tools.split(data, ':', 2);
        assert.deepEqual(out, [
            [{type: 'quote', pureData: '"1"'},
                {type: 'text', pureData: 'a*b*c'},
                {type: 'brace', pureData: '{{234}}'}], []
        ]);
    });
});