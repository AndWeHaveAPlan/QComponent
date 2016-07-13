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
        debugger;
        console.log(hu);
        //p.remove('spaceShip.qs');
        //console.log(p)
    });
});