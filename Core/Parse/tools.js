/**
 * Created by zibx on 05.07.16.
 */
module.exports = (function(){
    'use strict';
    var QObject = require('../../Base').QObject,
        spaces = /^\s*/,
        tabs = /\t/g,
        tab = new Array(4 + 1).join(' '),
        spaceCount = function (line) {
            var x = 0;
            line.replace(spaces, function (space) {
                x = space.replace(tabs, tab).length; // better - itterate by space string and do (length/tab_length|0)*tab_length
            });
            return x;
        };
    var DOUBLESLASH = 1,
        PAIRCOMMENT = 2,

        braces = ['()', '{}', '[]'],
        braceOpen = {},
        braceClose = {},
        braceType = {},
        quotes = QObject.arrayToObject(['"', '\'']);

    braces.forEach( function( el, i ){
        braceOpen[el[0]] = el[1];
        braceClose[el[1]] = el[0];
        braceType[el[0]] = braceType[el[1]] = i;
    });
    var SINGLELINECOMMENT = 1,
        MULTILINECOMMENT = 2;
    var U = new QObject({
            /**
             * Tokenize string to QS tokens
             */
            tokenizer: function( str ){
                /** braces can contain each other*/
                var braceStack = [], lastBrace, topBrace,
                    /** quotes can be single or double*/
                    inQuote = false, quoteType,
                    /** comments can be multiline or singleline*/
                    inComment = false, commentType,

                    tree = {items: []}, stack = [tree],

                    i, _i, s, sLast = '',

                    tokenStart = 0, lastTokenStart,
                    line, escape = false,

                    lastPushedPos,
                    pushItem = function(item){
                        lastPushedPos = item.pos + item.data.length;
                        tree.items.push(item);
                    };

                /** replace bad line endings to good one*/
                str = str.replace(/(\r\n|\n\r)/, '\n');

                /** char by char parsing */
                for( i = 0, _i = str.length; i < _i; i++){

                    /** s - current symbol, sLast - previous symbol */
                    s = str.charAt(i);
                    if(inComment || inQuote){
                        if(inComment){
                            if(commentType === SINGLELINECOMMENT && s === '\n'){
                                pushItem({
                                    pos: tokenStart,
                                    data: str.substr(tokenStart, i-tokenStart),
                                    type: 'comment',
                                    pureData: str.substr(tokenStart+2, i-tokenStart-2),
                                });
                                tokenStart = i+1;
                                inComment = false;
                            }else if(commentType === MULTILINECOMMENT && sLast === '*' && s === '/'){
                                pushItem({
                                    pos: tokenStart,
                                    data: str.substr(tokenStart, i-tokenStart+1),
                                    type: 'comment',
                                    pureData: str.substr(tokenStart+2, i-tokenStart-3),
                                });
                                tokenStart = i+1;
                                inComment = false;
                            }
                        }else{ /** if inQuote */
                            if(s === quoteType){
                                pushItem({
                                    pos: tokenStart,
                                    data: str.substr(tokenStart, i-tokenStart+1),
                                    pureData: str.substr(tokenStart+1, i-tokenStart-1),
                                    type: 'quote'
                                });
                                tokenStart = i+1;
                                inQuote = false;
                            }
                        }
                    }else{
                        lastTokenStart = tokenStart;
                        if(quotes[s] && !escape){
                            quoteType = s;
                            inQuote = true;
                            tokenStart = i;
                        }else if(sLast === '/' && s === '*'){
                            commentType = MULTILINECOMMENT;
                            inComment = true;
                            tokenStart = i-1;
                        }else if(sLast === '/' && s === '/'){
                            commentType = SINGLELINECOMMENT;
                            inComment = true;
                            tokenStart = i-1;
                        }else if(braceOpen[s]){
                            braceStack.push({type: s, pos: i});
                        }else if(braceClose[s]){
                            topBrace = braceStack.pop();
                            if(topBrace && braceClose[s] === topBrace.type){
                                pushItem({
                                    pos: topBrace.pos,
                                    data: str.substr(topBrace.pos, i - topBrace.pos+1),
                                    pureData: str.substr(topBrace.pos, i - topBrace.pos+1),
                                    type: 'brace',
                                    info: braceClose[s]
                                });
                            }else{
                                throw new Error('Invalid brace. opened: `'+(topBrace ? topBrace.type : 'No brace')+'`, closed: `'+s+'`')
                            }

                        }
                        if(lastTokenStart < tokenStart){
                            pushItem({
                                pos: lastTokenStart,
                                data: str.substr(lastTokenStart, tokenStart-lastTokenStart),
                                pureData: str.substr(lastTokenStart, tokenStart-lastTokenStart),
                                type: 'text'
                            });
                            //tokenStart = i;
                        }

                    }
                        //TODO logics
                    if(s === '\\')
                        escape = !escape;
                    sLast = s;
                }
                i !== lastPushedPos && pushItem({
                    pos: lastPushedPos,
                    data: str.substr(lastPushedPos),
                    pureData: str.substr(lastPushedPos),
                    type: 'text'
                });
                return tree;
            },
            replacer: function( from, to ){
                from = new RegExp( from, 'g' );
                return function( data ){
                    if( typeof data !== 'string' )
                        throw new Error( 'util.replacer: not a string;' + data );
                    return data.replace( from, to );
                };
            },
            preprocessor: function(str) {
                var blocks = {};

                var lines = str.replace(RE_BLOCKS, function (match, mlc, slc, position) {
                    //console.log(arguments)
                    if(mlc || slc){
                        var pos = getPos( str, position );
                        pos.data = match;
                        pos.comment = true;
                        (blocks[pos.row] || (blocks[pos.row] = [])).push( pos );
                        return match.replace(/[^\n\t]/g, ' ')
                    }
                    return mlc ? ' ' :         // multiline comment (replace with space)
                        slc ? '' :          // single/multiline comment
                            match;              // divisor, regex, or string, return as-is
                } ).split('\n' ).forEach( function( line, r ){
                    var row = r+ 1, pos;
                    if(line.trim().length > 0){
                        pos = {
                            data: line.trim(),
                            row: row,
                            col: spaceCount(line)+1
                        };
                        (blocks[pos.row] || (blocks[pos.row] = [])).push( pos );
                    }

                });

                return blocks;/*.sort(function(a,b){
                    var res = a.row - b.row;
                    return res || (a.col- b.col);
                });*/
            },

    } ),
    newLineReplacer = U.replacer(/(\r\n|\n\r)/, '\n');
    return U;
})();
var RE_BLOCKS = new RegExp([
        /\/(\*)[^*]*\*+(?:[^*\/][^*]*\*+)*\//.source,           // $1: multi-line comment
        /\/(\/)[^\n]*$/.source,                                 // $2 single-line comment
        /"(?:[^"\\]*|\\[\S\s])*"|'(?:[^'\\]*|\\[\S\s])*'/.source, // - string, don't care about embedded eols
        /(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/])/.source,           // - division operator
        /\/(?=[^*\/])[^[/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[/\\]*)*?\/[gim]*/.source
    ].join('|'),                                            // - regex
    'gm'  // note: global+multiline with replace() need test
);

// remove comments, keep other blocks
var getPos = function( str, pos ){
    var line = str.substr(0, pos),
        lines = line.split('\n'),
        allLines = str.split('\n'),
        col = allLines.reduce(function(store, line){
            if(!store.matched){
                if( store.pos < line.length ){
                    store.matched = true;
                }else{
                    store.pos -= line.length + 1;
                }
            }
            return store;
        }, {pos: pos, matched: false} ).pos + 1;
    return {row: lines.length, col: col};
};
//var pre = module.exports.preprocessor(require('fs' ).readFileSync('../../test/tmp' )+'');
var pre = module.exports.tokenizer(require('fs' ).readFileSync('../../test/trash/tmp2.txt' )+'');
console.log(pre);//module.exports.tokenize(pre));
console.log(3)

/*

tree = {
    col: 1,
    row: 1,
    pureLine: 'HBox o8faeh faeouh',
    type: 'HBox',
    rawLine: 'HBox o8faeh fa/!*faf*!/eouh',

    rawChildren:  '    a\n    /!**!/b\n',
    pureChildren: '    a\n        b\n',
    children: [
        {child1shit, parent: tree},
        {child2shit, parent: tree}
    ]
}*/
