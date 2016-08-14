/**
 * Created by zibx on 12.08.16.
 */
var Core = require('../Core');
var assert = require('chai').assert,
    escodegen = require('escodegen'),
    ASTtransformer = Core.Compile.ASTtransformer;



describe("ast transformations", function () {
    var VariableExtractor = Core.Compile.VariableExtractor;

    it("should work in simple cases", function () {
        var vars = VariableExtractor.parse('a=a+1+b.c.d[l]'), o = vars.getFullUnDefined(),
            list = {}, scope, j
            ;
        for(var i in o){
            scope = o[i];
            for(j in scope){
                scope[j].forEach(function(item){
                    list[item._id] = item;
                });
            }
        }
        console.log(new ASTtransformer().transform(vars.getAST(), o));
        console.log(Object.keys(list))
        //console.log(o.a);
        //o.a.a[0]._id = '22'
        //console.log(o.b)
        //console.log(escodegen.generate(o.b['b.c.d']))
    });
});