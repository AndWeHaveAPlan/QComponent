/**
 * Created by zibx on 05.07.16.
 */
module.exports = (function(){
    'use strict';
    var QObject = require( '../../Base' ).QObject,
        spaces = /^\s*/,
        tabs = /\t/g,
        tab = new Array( 4 + 1 ).join( ' ' ),
        spaceCount = function( line ){
            var x = 0;
            line.replace( spaces, function( space ){
                x = space.replace( tabs, tab ).length; // better - itterate by space string and do (length/tab_length|0)*tab_length
            } );
            return x;
        },
        leftTrim = function( line ){
            return line.replace( spaces, '' );
        };

    var braces = ['()', '{}', '[]'],
        braceOpen = {},
        braceClose = {},
        braceType = {},
        quotes = QObject.arrayToObject( ['"', '\''] );

    braces.forEach( function( el, i ){
        braceOpen[el[0]] = el[1];
        braceClose[el[1]] = el[0];
        braceType[el[0]] = braceType[el[1]] = i;
    } );
    var SINGLELINECOMMENT = 1,
        MULTILINECOMMENT = 2;

    var Pointer = function( cfg ){
        if( cfg ){
            this.col = cfg.col;
            this.row = cfg.row;
        }
    };
    Pointer.prototype = {
        col: 1,
        row: 1,
        clone: function( i ){
            return new Pointer( this ).add( i );
        },
        nextLine: function(){
            this.col = 1;
            this.row++;
            return this;
        },
        add: function( i ){
            if( i !== void 0 )
                this.col += i;

            return this;
        }
    };
    var clean = function( item ){
        delete item.parent;
        delete item.first;
        item.items && item.items.map(clean);
    };
    var U = new QObject( {
        /**
         * Tokenize string to QS tokens
         */
        tokenizer: function( str ){
            /** braces can contain each other*/
            var braceStack = [], topBrace = void 0,
                /** quotes can be single or double*/
                inQuote = false, quoteType = void 0,
                /** comments can be multiline or singleline*/
                inComment = false, commentType = void 0,

                line = { row: 1 }, lines = [line],

                tree = { items: [] },

                i, _i, s, sLast = '',

                /** cursor position */
                cursor = new Pointer(),

                tokenStart = 0, lastTokenStart,
                tokenStartCursor = cursor.clone(),
                lastPushedPosCursor = cursor.clone(),
                lastTokenStartCursor = cursor.clone(),

                escape = false,

                lastPushedPos,
                pushItem = function( item, cur ){
                    if( item.data.trim() === '' )
                        return;
                    cur = cur || tokenStartCursor;
                    lastPushedPos = item.pos + item.data.length;

                    tree.items.push( {
                        row: cur.row,
                        col: cur.col,
                        type: item.type,
                        info: item.info,
                        data: item.data,
                        pureData: item.pureData
                    } );
                },
                seal = function( line, tree ){
                    var i, _i, item;
                    for( i = 0, _i = tree.items.length; i < _i; i++ ){
                        item = tree.items[i];
                        if( item.type !== 'comment' ){
                            line.col = item.col + spaceCount( item.data );
                            item.pureData = leftTrim( item.pureData );
                            line.first = item;
                            break;
                        }
                    }

                    line.items = tree.items;
                };

            /** replace bad line endings to good one*/
            str = str.replace( /(\r\n|\n\r)/, '\n' );

            /** char by char parsing */
            for( i = 0, _i = str.length; i < _i; i++ ){

                /** s - current symbol, sLast - previous symbol */
                s = str.charAt( i );
                if( s === '\n' ){
                    cursor.row++;
                    cursor.col = 1;
                }
                if( inComment || inQuote ){
                    if( inComment ){
                        if( commentType === SINGLELINECOMMENT && s === '\n' ){
                            /** close of one line comment */
                            pushItem( {
                                pos: tokenStart,
                                data: str.substr( tokenStart, i - tokenStart ),
                                type: 'comment',
                                pureData: str.substr( tokenStart + 2, i - tokenStart - 2 )
                            } );
                            tokenStart = i + 1;
                            tokenStartCursor = cursor.clone();
                            inComment = false;
                        }else if( commentType === MULTILINECOMMENT && sLast === '*' && s === '/' ){
                            /** close of multi line comment */
                            pushItem( {
                                pos: tokenStart,
                                data: str.substr( tokenStart, i - tokenStart + 1 ),
                                type: 'comment',
                                pureData: str.substr( tokenStart + 2, i - tokenStart - 3 )
                            }, tokenStartCursor );
                            tokenStart = i + 1;
                            tokenStartCursor = cursor.clone();
                            inComment = false;
                        }
                    }else{ /** if inQuote */
                        if( s === quoteType ){
                            /** close of quote - check that it's same quote that was opened */
                            pushItem( {
                                pos: tokenStart,
                                data: str.substr( tokenStart, i - tokenStart + 1 ),
                                pureData: str.substr( tokenStart + 1, i - tokenStart - 1 ),
                                type: 'quote'
                            }, tokenStartCursor );
                            tokenStart = i + 1;
                            tokenStartCursor = cursor.clone();
                            inQuote = false;
                        }
                    }
                }else{
                    lastTokenStart = tokenStart;
                    lastTokenStartCursor = tokenStartCursor.clone();

                    if( quotes[s] && !escape ){
                        /** quote open */
                        quoteType = s;
                        inQuote = true;
                        tokenStart = i;
                        tokenStartCursor = cursor.clone( -1 );

                    }else if( sLast === '/' && s === '*' ){
                        /** multi line comment open */
                        commentType = MULTILINECOMMENT;
                        inComment = true;
                        tokenStart = i - 1;
                        tokenStartCursor = cursor.clone( -2 );

                    }else if( sLast === '/' && s === '/' ){
                        /** single line comment open */
                        commentType = SINGLELINECOMMENT;
                        inComment = true;
                        tokenStart = i - 1;
                        tokenStartCursor = cursor.clone( -2 );

                    }

                    /** if start of token changed in this brunch -> store intermediate data as text */
                    if( lastTokenStart < tokenStart ){
                        pushItem( {
                            pos: lastTokenStart,
                            data: str.substr( lastTokenStart, tokenStart - lastTokenStart ),
                            pureData: str.substr( lastTokenStart, tokenStart - lastTokenStart ),
                            type: 'text'
                        }, lastTokenStartCursor );
                        tokenStartCursor = lastTokenStartCursor = cursor.clone();
                        //tokenStart = i;
                    }
                    if( braceOpen[s] ){
                        /** brace open -> push it's type and position to stack */
                        pushItem( {
                            data: str.substr( tokenStart, i - tokenStart ),
                            pureData: str.substr( tokenStart, i - tokenStart ),
                            type: 'text'
                        }, tokenStartCursor );

                        tokenStart = i;
                        tokenStartCursor = cursor.clone();
                        pushItem( {
                            data: '@@@',
                            pureData: '@@@',
                            type: 'brace',
                            info: s
                        } );
                        var item = tree.items.pop();
                        item.items = [];
                        item.parent = tree;
                        tree.items.push( item );
                        //stack.push(item);
                        tree = item;
                        braceStack.push( { type: s, pos: i, cursor: cursor.clone() } );
                    }else if( braceClose[s] ){
                        /** brace close -> check that there is corresponding open one */

                        topBrace = braceStack.pop();
                        if( topBrace && braceClose[s] === topBrace.type ){


                            tree.data = str.substr( topBrace.pos, i - topBrace.pos + 1 );
                            tree.pureData = str.substr( topBrace.pos, i - topBrace.pos + 1 );
                            tree = tree.parent;

                            tokenStart = i + 1;
                            tokenStartCursor = cursor.clone( 1 );
                        }else{
                            throw new Error( 'Invalid brace. opened: `' + (topBrace ? topBrace.type : 'No brace') + '`, closed: `' + s + '`' );
                        }

                    }

                }

                if( s === '\n' && !braceStack.length && !inComment && !inQuote ){
                    /** SEAL */

                    pushItem( {
                        pos: tokenStart,
                        data: str.substr( tokenStart, i - tokenStart ),
                        pureData: str.substr( lastTokenStart, i - tokenStart ),
                        type: 'text'
                    }, lastTokenStartCursor );
                    tokenStart = i + 1;
                    tokenStartCursor = cursor.clone().nextLine();

                    seal( line, tree );
                    line.items = tree.items;
                    line = { row: cursor.row };
                    lines.push( line );

                    tree = { items: [] };
                }

                //TODO logics
                if( s === '\\4' )
                    escape = !escape;
                sLast = s;

                cursor.col++;
            }
            i !== lastPushedPos && pushItem( {
                pos: lastPushedPos,
                data: str.substr( lastPushedPos ),
                pureData: str.substr( lastPushedPos ),
                type: 'text'
            }, lastPushedPosCursor );
            seal( line, tree );
            return lines;
        },
        metaDataExtractor: function( line ){
            var type, out = {}, first,
                notComment = function( el ){return !(el.type === 'comment')},
                getData = function( el ){return el.data};
            if( first = line.first ){
                type = first.pureData.match( /[\s]*(#?[^\s\.#:{]*)/ )
                if( type && (type = type[0]) ){
                    out.type = type;
                    out.bonus = first.pureData.substr( type.length );
                }
            }
            out.pureLine = line.items.filter( notComment ).map( getData ).join( '' );
            out.rawLine = line.items.map( getData ).join( '' );
            out.items = line.items;
            out.col = line.col;
            out.row = line.row;

            return out;
        },
        treeBuilder: function( lines ){
            /*var out = [],
                items = lines.map( U.metaDataExtractor ),
                item, i = 0, _i = items.length, line, indent;
            do{
                item = items[i];
                if( lastIndent === void 0 )
                    i++;
            }while( i < _i )*/

            lines = lines.map( U.metaDataExtractor );
            var line,
                padding, lastPadding = 0, i, _i, j,

                root = {children: [], col: 0},
                stack = [root], head = root;
            for( i = 0, _i = lines.length; i < _i; i++ ){
                line = lines[i];
                if (line.col !== void 0) {
                    padding = line.col;

                    /** searching for parent by itterating over stack.
                     * stops when parent indent is less than current line indent */

                    if(padding<=lastPadding) {
                        for(j = stack.length - 1; j;)
                            if((head = stack[--j]).col < padding)
                                break;

                        stack.length = j + 1;
                        head = stack[j];
                    }

                    /** clean circular links. we do not need them any more */
                    clean(line);

                    (head.children || (head.children = [])).push(line);
                    stack.push(line);
                    head = line;

                    lastPadding = padding;
                }
            }

            return root.children;
        },
        replacer: function( from, to ){
            from = new RegExp( from, 'g' );
            return function( data ){
                if( typeof data !== 'string' )
                    throw new Error( 'util.replacer: not a string;' + data );
                return data.replace( from, to );
            };
        }
    } );

    //var pre = module.exports.preprocessor(require('fs' ).readFileSync('../../test/tmp' )+'');

    /*pre.map(function(el){
        console.log(el.row+':'+el.indent+' '+el.items.map(function(item){
                return item.col+':'+({text:'T',comment:'%',brace:'<',quote:'Q'}[item.type])+item.data.substr(0,30);}).join('|'));
    });*/
    //module.exports.tokenize(pre));

    var pre = U.tokenizer( require( 'fs' ).readFileSync( '../../test/tokenize/tmp4.txt' ) + '' );
    var tree = U.treeBuilder( pre );
    console.dir( tree );
    console.log( JSON.stringify(tree,null,2) );

    return U;
})();


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
