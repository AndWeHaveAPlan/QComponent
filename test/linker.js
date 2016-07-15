/**
 * Created by zibx on 7/9/16.
 */
'use strict';
var assert = require('chai').assert;
var Core = require('../Core' ),
    Linker = Core.Compile.Linker,
    fs = require('fs'),
    path = require('path');

describe('Linker', function() {
    var chackboxMetaData;
    it('should extract metadata', function () {
        var base = './test/linker_data';
        var p = new Linker({mapping: {
            id: function () {
                return this;
            },
            code: function () {
                return fs.readFileSync(path.join(base,this))+'';
            }
        }});
        fs.readdirSync(base).forEach(p.add.bind(p));
        var hu = p.getMetadata();
        console.log(hu.Checkbox);//.children[3]);
        console.log(hu.Checkbox.children);
        chackboxMetaData = hu;//{Checkbox: hu.Checkbox};
        //p.remove('spaceShip.qs');
        //console.log(p)
    });
    it('should generate js', function(){
        console.log(Core.Compile.Compiler.compile(chackboxMetaData));
    });
});