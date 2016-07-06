/**
 * Created by zibx on 06.07.16.
 */
'use strict';
var assert = require('chai').assert;
var Core = require('../Core' ),
    parser = Core.Parse.Parser;
var compactItem = function( item ){
    return item.type +'|'+ item.bonus + '['+(item.children ? item.children.map(compactItem).join(','):'')+']';
};
var compact = function(tree){
    return tree.map(compactItem).join('\n');
};
describe('Parser', function(){

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



    it('tokenizer long test', function(){
        var testCase, result;

        var checks = ['row', 'col', 'type', 'pureData'];
        var tokenCompare = function(obj, check){
            for(var i = 2, _i = check.length; i < _i; i++)


                    check[i] !== obj[checks[i]] && assert.fail(obj,
                        {[checks[i]]: check[i]},
                        'expected ' + checks[i] + ' to be ' + check[i] + ' but got ' + obj[checks[i]]
                    );

        };

        testCase = require( 'fs' ).readFileSync( './test/tokenize/tmp1.txt' ) + '';
        result = parser.tokenizer(testCase);
        assert.equal(result[0].row, 1);

        var row, sub, rowNum, resNum = 0;
        
        row = result[resNum++].items; sub = 0;
        assert.equal(tokenCompare(row[sub++], [1, 1, 'text', 'kk']));
        assert.equal(tokenCompare(row[sub++], [1, 4, 'comment']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0;
        assert.equal(tokenCompare(row[sub++], [22, 1, 'text', 'a a  aaa']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0;
        assert.equal(tokenCompare(row[sub++], [23, 1, 'text', 'bb']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0;
        assert.equal(tokenCompare(row[sub++], [24, 1, 'text', 'div.mdl-']));
        assert.equal(tokenCompare(row[sub++], [24, 9, 'comment', 'comment']));
        assert.equal(tokenCompare(row[sub++], [24, 20, 'text', 'grid ']));
        assert.equal(tokenCompare(row[sub++], [24, 25, 'comment', 'lulza']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0;
        assert.equal(tokenCompare(row[sub++], [25, 1, 'text', 'foreach items']));
        assert.equal(tokenCompare(row[sub++], [25, 9, 'comment', 'tral']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 26;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'comment', '']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 5, 'text', 'div.mdl-cell. ']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 19, 'quote', '\\\'\\\' \\\'\\\' /*ni*/']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 37, 'brace', '{{/ijij}}']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 46, 'text', ' mdl-cell--']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 57, 'brace', '{{count|12/count}}']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 75, 'text', '-col.mdl-cell--']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 90, 'brace', '{{count|12/count}}']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 108, 'text', '-col-tablet']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 27;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'comment', '      render this']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 28;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'comment', 'jajica']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 29;
        assert.equal(tokenCompare(row[sub++], [rowNum, 5, 'text', 'def UICancer']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 30;
        assert.equal(tokenCompare(row[sub++], [rowNum, 7, 'text', 'childrenType: raw']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 31; // empty row
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 32;
        assert.equal(tokenCompare(row[sub++], [rowNum, 5, 'text', 'div']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 33;
        assert.equal(tokenCompare(row[sub++], [rowNum, 7, 'comment', 'USE ClosureScript']));
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 34; // empty row
        assert.equal(row.length, sub);

        row = result[resNum++].items; sub = 0; rowNum = 35;
        assert.equal(tokenCompare(row[sub++], [rowNum, 9, 'text', '.click: ']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 17, 'brace', '()']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 19, 'text', ' ->']));
        assert.equal(row.length, sub);

        //assert.equal(result)
    });
});