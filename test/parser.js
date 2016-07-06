/**
 * Created by zibx on 06.07.16.
 */
var assert = require('chai').assert;
var Core = require('../Core' ),
    parser = Core.Parse.Parser;

describe('Parser', function(){
    'use strict';
    it('simple tokenize', function(){
        var testCase = 'Button a';
        assert.deepEqual(parser.tokenizer(testCase), [
            {
                'col': 1,
                'first': {
                    'col': 1,
                    'data': 'Button a',
                    'info': void 0,
                    'pureData': 'Button a',
                    'row': 1,
                    'type': 'text'
                },
                'items': [
                    {
                        'col': 1,
                        'data': 'Button a',
                        'info': void 0,
                        'pureData': 'Button a',
                        'row': 1,
                        'type': 'text'
                    }
                ],
                'row': 1
            }
        ]);

    });
    it('simplest tree', function(){
        var testCase = 'Button a',
            result = parser.treeBuilder(parser.tokenizer(testCase));
        assert.equal(result[0].type, 'Button');
        assert.equal(result[0].children, void 0);
        assert.equal(result[0].bonus, ' a');
    });
    var compactItem = function( item ){
        return item.type +'|'+ item.bonus + '['+(item.children ? item.children.map(compactItem).join(','):'')+']';
    };
    var compact = function(tree){
        return tree.map(compactItem).join('\n');
    };
    it('simple tree', function(){
        var testCase, result;

        testCase = 'Button a\n  Button b';
        result = parser.treeBuilder(parser.tokenizer(testCase));

        assert.equal(result[0].type, 'Button');
        assert.equal(result[0].bonus, ' a');

        assert.equal(result[0].children.length, 1);
        assert.equal(result[0].children[0].type, 'Button');
        assert.equal(result[0].children[0].bonus, ' b');

        testCase = 'Button a\n  Button b\n Button c\n';
        result = parser.treeBuilder(parser.tokenizer(testCase));
        assert.equal(compact(result), 'Button| a[Button| b[],Button| c[]]');

        testCase = 'Button a\n  Button b{{\nhwaduh}}\n  Button c\n';
        result = parser.treeBuilder(parser.tokenizer(testCase));
        assert.equal(compact(result), 'Button| a[Button| b[],Button| c[]]');

        testCase = 'Button a\n  Button b{{\nhwa/*du*/h}}\n  Button c\n';
        result = parser.treeBuilder(parser.tokenizer(testCase));
        assert.equal(compact(result), 'Button| a[Button| b[],Button| c[]]');


        testCase = 'Button a\n  Button b\n  Button c';
        result = parser.treeBuilder(parser.tokenizer(testCase));
        assert.equal(compact(result), 'Button| a[Button| b[],Button| c[]]');
    });
    it('tokenizer test', function(){
        var testCase, result;

        testCase =
'Button a\n\
  Button b\n\
  Button c';
        result = parser.tokenizer(testCase);
        assert.equal(result[0].row, 1);
        assert.equal(result[1].row, 2);
        assert.equal(result[2].row, 3);

        assert.equal(result[0].col, 1);
        assert.equal(result[1].col, 3);
        assert.equal(result[2].col, 3);
        //assert.equal(result)
    });
});