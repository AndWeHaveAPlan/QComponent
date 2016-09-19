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
                    '_info': void 0,
                    'pureData': 'Button a',
                    'row': 1,
                    'type': 'text'
                },
                'items': [
                    {
                        'col': 1,
                        'data': 'Button a',
                        'info': void 0,
                        '_info': void 0,
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
'Button a\n'+
'  Button b\n'+
'  Button c';
        result = parser.tokenizer(testCase);
        assert.equal(result[0].row, 1);
        assert.equal(result[1].row, 2);
        assert.equal(result[2].row, 3);

        assert.equal(result[0].col, 1);
        assert.equal(result[1].col, 3);
        assert.equal(result[2].col, 3);
        //assert.equal(result)
    });



    it('tokenizer comments tests', function(){
        var result = parser.tokenizer('(e/*haha*/m/**/h)'),
            children = result[0].items[0].items;
        assert.equal(children.length, 5);
        assert.equal(children[0].pureData, 'e');
        assert.equal(children[2].pureData, 'm');
        assert.equal(children[4].pureData, 'h');

    });
    it('tokenizer long test', function(){
        var testCase, result;

        var checks = ['row', 'col', 'type', 'pureData'],
            wrongs = [];
        var tokenCompare = function(obj, check){
            for(var i = 2, _i = check.length; i < _i; i++){
                var tmp = {};
                tmp[checks[i]] = check[i];
                check[i] !== obj[checks[i]] && assert.fail(obj,
                    tmp,
                    'expected ' + checks[i] + ' to be ' + check[i] + ' but got ' + obj[checks[i]]
                );
            };
            var indentOk = false;
            if(sub===1 && check[2] === 'text')
                if(check[1] === full.col) {
                    indentOk = true;
                }else{
                    wrongs.push('INDENT ' +check[1] +'|'+ full.col+')'+ obj.row + ':' + obj.col + '->' + check[0] + ':' + check[1] + ' `' + obj.data + '`');
                }
            for(var i = 0, _i = check.length; i < _i; i++)
                if(i===1){
                    !indentOk && check[i] !== obj[checks[i]] && wrongs.push(result[resNum-1].col+' '+obj.row+':'+obj.col + '->' +check[0]+':'+check[1] + ' `'+obj.data+'`');
                }else
                    check[i] !== obj[checks[i]] && wrongs.push(result[resNum-1].col+' '+obj.row+':'+obj.col + '->' +check[0]+':'+check[1] + ' `'+obj.data+'`');

        };

        testCase = require( 'fs' ).readFileSync( './test/tokenize/tmp1.txt' ) + '';
        result = parser.tokenizer(testCase);

        require( 'fs' ).writeFileSync('./test/tokenize/tmp1.tokens.json', JSON.stringify(result,function( key, value) {
            if( key == 'parent') { return '~CIRCULAЯ~';}
            else {return value;}
        },2));
        require( 'fs' ).writeFileSync('./test/tokenize/tmp1.ast.json', JSON.stringify(parser.treeBuilder( result),function( key, value) {
            if( key == 'parent') { return '~CIRCULAЯ~';}
            else {return value;}
        },2));

        assert.equal(result[0].row, 1);

        var row, sub, rowNum, resNum = 0, full;
        
        full = result[resNum++]; row = full.items; sub = 0; rowNum = 1;
        assert.equal(tokenCompare(row[sub++], [rowNum, 2, 'text', 'kk']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 4, 'comment']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 22;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'text', 'a a  aaa']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 23;
        assert.equal(tokenCompare(row[sub++], [rowNum, 4, 'text', 'bb']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 24;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'text', 'div.mdl-']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 9, 'comment', 'comment']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 20, 'text', 'grid ']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 25, 'comment', 'lulza']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 25;
        assert.equal(tokenCompare(row[sub++], [rowNum, 3, 'text', 'foreach items']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 16, 'comment', 'tral']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 26;
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

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 27;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'comment', '      render this']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 28;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'comment', 'jajica']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 29;
        assert.equal(tokenCompare(row[sub++], [rowNum, 5, 'text', 'def UICancer']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 30;
        assert.equal(tokenCompare(row[sub++], [rowNum, 7, 'text', 'childrenType: raw']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 31; // empty row
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 32;
        assert.equal(tokenCompare(row[sub++], [rowNum, 5, 'text', 'div']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 33;
        assert.equal(tokenCompare(row[sub++], [rowNum, 7, 'comment', 'USE ClosureScript']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 34; // empty row
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 35;
        assert.equal(tokenCompare(row[sub++], [rowNum, 9, 'text', '.click: ']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 17, 'brace', '()']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 19, 'text', ' ->']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 36;
        assert.equal(tokenCompare(row[sub++], [rowNum, 13, 'text', 'if']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 15, 'brace', '( store.pos {{}} < line.length )']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 47, 'brace', '{\n'+
            '                store.matched = true;\n'+
            '           }']));
        assert.equal(tokenCompare(row[sub++], [38, 13, 'text', 'else']));
        assert.equal(tokenCompare(row[sub++], [38, 17, 'brace', '{\n'+
        '                store.pos -= line.length + 1;\n'+
        '            }']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 41;
        assert.equal(tokenCompare(row[sub++], [rowNum, 9, 'text', '.mouseup']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 17, 'brace', '()']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 19, 'text', ' ->']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 42; // empty row
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 43;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'text', 'Input i1']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 44;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'text', 'Input i2']));
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 45; // empty row
        assert.equal(row.length, sub);

        full = result[resNum++]; row = full.items; sub = 0; rowNum = 46;
        assert.equal(tokenCompare(row[sub++], [rowNum, 1, 'text', 'Button: ']));
        assert.equal(tokenCompare(row[sub++], [rowNum, 9, 'brace', '{{\'У вас\'+ i1 +\'новых писем\'+ i2}}']));
        assert.equal(row.length, sub);

        if(wrongs.length) {
            console.error(wrongs);
            assert.fail(wrongs);
        }
        //assert.equal(result)
    });
});