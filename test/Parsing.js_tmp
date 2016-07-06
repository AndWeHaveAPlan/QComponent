/**
 * Created by ravenor on 29.06.16.
 */
var assert = require('chai').assert;


var Base = require('../Base');
var factory = require('..' ).Component.Factory;
var QObject = Base.QObject;
var UIComponent = Base.Component.UIComponent;
//var Parser = require('parser');

var Parser = {
    parse: function () {
    }
};

describe("QScript parser", function () {
    it("should build tree", function () {

        var resultTree = Parser.parse('div: 123\n' +
            '  Button: a\r\n' +
            '  Button: b\n'
        );


        var mustHaveTree = {
            col: 1,
            row: 1,
            pureLine: 'div: 123\r\n',
            type: 'Div',
            ravLine: 'div: 123\r\n',
            rawChildren: '  Button: a\r\n  Button: b\r\n',
            pureChildren: '  Button: a\r\n  Button: b\r\n',
            children: [
                {
                    col: 3,
                    row: 2,
                    pureLine: 'Button: a\r\n',
                    type: 'Button',
                    ravLine: 'Button: a\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                },
                {
                    col: 3,
                    row: 3,
                    pureLine: 'Button: b\r\n',
                    type: 'Button',
                    ravLine: 'Button: b\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                }
            ]
        };

        mustHaveTree.children[0].parent = mustHaveTree;
        mustHaveTree.children[1].parent = mustHaveTree;


        var mustHaveTree2 = {
            col: 1,
            row: 1,
            pureLine: 'div: 123\r\n',
            type: 'Div',
            ravLine: 'div: 123\r\n',
            rawChildren: '  Button: a\r\n  Button: b\r\n',
            pureChildren: '  Button: a\r\n  Button: b\r\n',
            children: [
                {
                    col: 3,
                    row: 2,
                    pureLine: 'Button: a\r\n',
                    type: 'Button',
                    ravLine: 'Button: a\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                },
                {
                    col: 3,
                    row: 3,
                    pureLine: 'Button: b\r\n',
                    type: 'Button',
                    ravLine: 'Button: b\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                }
            ]
        };

        mustHaveTree2.children[0].parent = mustHaveTree2;
        mustHaveTree2.children[1].parent = mustHaveTree2;


        //assert.deepEqual(resultTree, mustHaveTree);
        assert.deepEqual(mustHaveTree, mustHaveTree2);
    });

    it("should ignore comments", function () {

        var resultTree = Parser.parse(
            'div: /*blah  */ 123\n' +
            '  Button: a\n' +
            ' //blah bla\n' +
            '  Button: b\n'
        );

        var mustHaveTree = {
            col: 1,
            row: 1,
            pureLine: 'div:  123\r\n',
            type: 'Div',
            ravLine: 'div: /*blah  */ 123\r\n',
            rawChildren: '  Button: a\r\n //blah bla\n  Button: b\r\n',
            pureChildren: '  Button: a\r\n \r\n  Button: b\r\n',
            children: [
                {
                    col: 3,
                    row: 2,
                    pureLine: 'Button: a\r\n',
                    type: 'Button',
                    ravLine: 'Button: a\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                },
                {
                    col: 3,
                    row: 4,
                    pureLine: 'Button: b\r\n',
                    type: 'Button',
                    ravLine: 'Button: b\r\n',
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

    it("should ignore multiline comments", function () {

        var resultTree = Parser.parse(
            'div: /*blah  */ 123\n' +
            ' /* wefdfg adfrsg dfg adegr \r\n' +
            '*/Button: a/r\n' +
            ' //blah bla\n' +
            '  Button: b\r\n'
        );

        var mustHaveTree = {
            col: 1,
            row: 1,
            pureLine: 'div:  123\r\n',
            type: 'Div',
            ravLine: 'div: /*blah  */ 123\r\n',
            rawChildren: ' /* wefdfg adfrsg dfg adegr \r\n*/Button: a\r\n //blah bla\n  Button: b\r\n',
            pureChildren: '  Button: a\r\n \r\n  Button: b\r\n',
            children: [
                {
                    col: 3,
                    row: 3,
                    pureLine: 'Button: a\r\n',
                    type: 'Button',
                    ravLine: 'Button: a\r\n',
                    rawChildren: '',
                    pureChildren: '',
                    children: []
                },
                {
                    col: 3,
                    row: 5,
                    pureLine: 'Button: b\r\n',
                    type: 'Button',
                    ravLine: 'Button: b\r\n',
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

    it("deep nesting", function () {

        var resultTree = Parser.parse(
            'div: 123\n' +
            '  div: 321\n' +
            '    div: 1\n'
        );

        var mustHaveTree = {
            col: 1,
            row: 1,
            pureLine: 'div: 123\r\n',
            type: 'Div',
            ravLine: 'div: 123\r\n',
            rawChildren: '  div: 321\r\n    div: 1\r\n      Button: a\r\n      Button: b\r\n',
            pureChildren: '  div: 321\r\n    div: 1\r\n      Button: a\r\n      Button: b\r\n',
            children: []
        };

        mustHaveTree.children[0] = {
            parent: mustHaveTree,
            col: 3,
            row: 2,
            pureLine: '  div: 321\r\n',
            type: 'Div',
            ravLine: '  div: 321\r\n',
            rawChildren: '    div: 1\r\n      Button: a\r\n      Button: b\r\n',
            pureChildren: '    div: 1\r\n      Button: a\r\n      Button: b\r\n',
            children: []
        };

        mustHaveTree.children[0].children[0] = {
            parent: mustHaveTree.children[0],
            col: 3,
            row: 2,
            pureLine: '    div: 1\r\n',
            type: 'Div',
            ravLine: '    div: 1\r\n',
            rawChildren: '      Button: a\r\n      Button: b\r\n',
            pureChildren: '      Button: a\r\n      Button: b\r\n',
            children: []
        };

        mustHaveTree.children[0].parent = mustHaveTree;
        mustHaveTree.children[1].parent = mustHaveTree;

        assert.deepEqual(resultTree, mustHaveTree);
    });


    var f = new factory(), obj;
    var document = require("dom-lite").document;
    ('a,b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
    'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
    'input,label,li,ol,option,p,pre,span,sub,sup,' +
    'table,tbody,td,textarea,th,thead,tr,u,ul,header')
        .split(',')
        .forEach(function (name) {
            UIComponent.extend(name, {
                createEl: function () {
                    this.el = document.createElement(name);
                },
                addToTree: function (child) {
                    //console.log(child)
                    child.el && (this.el || this.parent.el).appendChild(child.el);
                    //(this.el || this.parent.el).appendChild(document.createTextNode('84'))
                },
                preInit: function () {

                    if (this.value) {
                        this.textNode = f.build('textNode', {value: this.value});
                        this._children.unshift(this.textNode);
                    }

                },
                _setter: {
                    value: function (key, val) {
                        console.log(val)
                        this.textNode && (this.textNode.set('value', val));
                    }
                }
            });
        });

    UIComponent.extend('textNode', {
        component: true,
        _setter: {
            value: function (key, val) {
                this.el.nodeValue = val;
            }
        },
        createEl: function () {
            this.el = document.createTextNode('');
        }
    });

    UIComponent.extend('Button', {
        component: true,
        _setter: {
            value: function (key, val) {
                this.el.nodeValue = val;
            }
        },
        createEl: function () {
            this.el = document.createTextNode('<button></button>');
        }
    });


    it('should nests', function () {

        var resultTree = Parser.parse('div: 123\n' +
            '  Button: a\r\n' +
            '  Button: b\n'
        );

        var newTree = Parser.doMagic(resultTree);

        assert.equal(newTree.el.outerHTML, '<div><button>a</button><button>b</button></div>');
    });
});