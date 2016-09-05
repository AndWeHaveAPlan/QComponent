/**
 * Created by zibx on 12.08.16.
 */
var Core = require('../Core');
var assert = require('chai').assert,
    escodegen = require('escodegen'),
    ASTtransformer = Core.Compile.ASTtransformer;



describe("ast transformations", function () {
    "use strict";
    var VariableExtractor = Core.Compile.VariableExtractor;
    var transform = function(source){
        var vars = VariableExtractor.parse(source), o = vars.getFullUnDefined();
        return new ASTtransformer().transform(vars.getAST(), o, {escodegen: {format: {compact: true}}});
    };
    it("should work in simple cases", function () {
        assert.equal(transform('a=2;'), 'a.set([\'value\'],2);');
        assert.equal(transform('a=b;'), 'a.set([\'value\'],b.get([\'value\']));');
        assert.equal(transform('a=b+2;'), 'a.set([\'value\'],b.get([\'value\'])+2);');
        assert.equal(transform('a=2+b;'), 'a.set([\'value\'],2+b.get([\'value\']));');
        assert.equal(transform('var x; a=x+b;'), 'var x;a.set([\'value\'],x+b.get([\'value\']));');
        assert.equal(transform('var x = 5; a=x+b;'), 'var x=5;a.set([\'value\'],x+b.get([\'value\']));');
        assert.equal(transform('var x = a;'), 'var x=a.get([\'value\']);');
    });
    it("should work in complex cases", function () {
        assert.equal(transform('a.b.c=2;'), 'a.set([\'b\',\'c\'],2);');
        assert.equal(transform('a.b.c[d]=2;'), 'a.set([\'b\',\'c\',d.get([\'value\'])],2);');
        //assert.equal(transform('a.b.c[d]'), 'a.set([\'b\',\'c\',d.get([\'value\'])],2);');

        
        assert.equal(transform('var x; a.b.c[d?x:d.e]=2;'), 'var x;a.set([\'b\',\'c\',d.get([\'value\'])?x:d.get([\'e\'])],2);');
    });

    it("should work in unary cases", function () {
        assert.equal(transform('a++;'), 'a.set([\'value\'],a.get([\'value\'])+1);');
        assert.equal(transform('a--;'), 'a.set([\'value\'],a.get([\'value\'])-1);');
        assert.equal(transform('!a;'), '!a.get([\'value\']);');
    });


    it("should work in ololo cases", function () {
        //console.log(JSON.stringify(VariableExtractor.parse('a++').getAST()))
        assert.equal(transform('a+=1;'), 'a.set([\'value\'],a.get([\'value\'])+1);');
        assert.equal(transform('a-=1;'), 'a.set([\'value\'],a.get([\'value\'])-1);');
        assert.equal(transform('a*=g;'), 'a.set([\'value\'],a.get([\'value\'])*g.get([\'value\']));');
        assert.equal(transform('a/=a;'), 'a.set([\'value\'],a.get([\'value\'])/a.get([\'value\']));');
    });

    it("bugfix cases", function () {
        assert.equal(transform('var x;\nx().slice();'),'var x;x().slice();');
        assert.equal(transform('var x = list1.itemSource;\n'+
            'x = x.push({name: addOne}).slice();\n'+
            'list1.itemSource = x;'),'var x=list1.get([\'itemSource\']);x=x.push({name:addOne.get([\'value\'])}).slice();list1.set([\'itemSource\'],x);');
    });

});