/**
 * Created by ravenor on 29.06.16.
 */
var assert = require('chai').assert;


var Base = require('../Base');
var QObject = Base.QObject;
//var Parser = require('parser');

describe("QScript parser", function () {
    it("should build tree", function () {

        var resultTree = Parser.parse('div: 123\n' +
            '  Button: a/n' +
            '  Button: b/n'
        );


        var mustHaveTree = {
            col: 1,
            row: 1,
            pureLine: 'div: 123',
            type: 'Div',
            ravLine: 'div: 123',
            rawChildren: '  Button: a\r\n  Button: b\r\n',
            pureChildren: '  Button: a\r\n  Button: b\r\n',
            children: [
                {
                    col: 3,
                    row: 2,
                    pureLine: 'Button: a',
                    type: 'Button',
                    ravLine: 'Button: a',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                },
                {
                    col: 3,
                    row: 3,
                    pureLine: 'Button: b',
                    type: 'Button',
                    ravLine: 'Button: b',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                }
            ]
        };

        mustHaveTree.children[0].parent = mustHaveTree;
        mustHaveTree.children[1].parent = mustHaveTree;

        assert.deepEqual(resultTree, mustHaveTree);
    });
});